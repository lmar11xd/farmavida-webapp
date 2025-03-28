import { Timestamp } from "@angular/fire/firestore";

export interface Product {
    id?: string,
    code: string,
    name: string,
    description?: string,
    expirationDate?: Date | Timestamp | null,
    quantity: number,
    costPrice: number,
    salePrice: number,
    um?: string,
    laboratory?: string,
    lot?: string,
    sanitaryReg?: string
}