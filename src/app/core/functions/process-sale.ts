import { runTransaction, Firestore, DocumentReference } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { Sale } from '../models/sale';

export async function processSaleTransaction(
  firestore: Firestore,
  productsSold: Product[],
  saleRef: DocumentReference<Sale>,
  buildSaleData: () => Sale,
  getProductRef: (id: string) => DocumentReference<Product>,
  log: boolean = false
): Promise<void> {
  await runTransaction(firestore, async (tx) => {
    if (log) console.log('Iniciando transacción de venta');

    // 1️⃣ Leer todos los productos
    const productRefs = productsSold.map(p => getProductRef(p.id!));
    const productSnaps = await Promise.all(productRefs.map(ref => tx.get(ref)));

    // 2️⃣ Validar stock
    productSnaps.forEach((snap, i) => {
      if (!snap.exists()) {
        throw new Error(`El producto "${productsSold[i].name}" no existe.`);
      }

      const current = snap.data() as Product;
      if (log) console.log(`${productsSold[i].name}: actual=${current.quantity}, requerido=${productsSold[i].quantity}`);

      if (current.quantity < productsSold[i].quantity) {
        throw new Error(`Stock insuficiente para "${productsSold[i].name}".`);
      }
    });

    // 3️⃣ Actualizar stock
    productSnaps.forEach((snap, i) => {
      const newQuantity = (snap.data() as Product).quantity - productsSold[i].quantity;
      tx.update(productRefs[i], { quantity: newQuantity });
      if (log) console.log(`Stock actualizado para ${productsSold[i].name}: nuevo=${newQuantity}`);
    });

    // 4️⃣ Crear venta
    const sale = buildSaleData();
    tx.set(saleRef, sale);
    if (log) console.log(`Venta registrada con ID: ${saleRef.id}`);
  });

  if (log) console.log('Transacción completada con éxito');
}
