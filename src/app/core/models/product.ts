import { Timestamp } from "@angular/fire/firestore";
import { StatusEntryEnum } from '../enums/status-entry.enum';

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
    sanitaryReg?: string,
    processingStatus?: StatusEntryEnum,
    processingDate?: Date | Timestamp | null,
    createdAt?: Date | Timestamp | null,
    updatedAt?: Date | Timestamp | null,
    createdBy?: string,
    updatedBy?: string
}
