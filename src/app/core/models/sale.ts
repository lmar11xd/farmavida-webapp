import { Timestamp } from '@angular/fire/firestore';
import { Product } from "./product";

export interface Sale {
  id?: string,
  code: string,
  products: Product[],
  total: number,
  sellerId: string,
  boxId: string,
  saleDate: Date | Timestamp,
  createdAt?: Date | Timestamp | null,
  updatedAt?: Date | Timestamp | null,
  createdBy?: string,
  updatedBy?: string
}
