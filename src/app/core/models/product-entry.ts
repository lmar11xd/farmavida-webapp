import { Timestamp } from "@angular/fire/firestore";
import { StatusEntryEnum } from "../enums/status-entry.enum";
import { Product } from "./product";

export interface ProductEntry {
    id?: string,
    products: Product[],
    fileName: string,
    entryDate: Timestamp | Date | null,
    status: StatusEntryEnum,
    processingDate?: Timestamp | Date | null,
    username: string
}