import { Timestamp } from '@angular/fire/firestore';
import { Product } from "./product";

export interface Sale {
    id?: string,
    products: Product[],
    total: number,
    saleDate: Date,
    createdAt?: Date | Timestamp | null,
    updatedAt?: Date | Timestamp | null,
    createdBy?: string,
    updatedBy?: string
}
