import { Timestamp } from 'firebase/firestore';

export interface Box {
  id?: string;
  sellerId: string;
  openingDate: Date | Timestamp;
  closingDate?: Date | Timestamp | null;
  sales: number;
  initialAmount: number;
  finalAmount?: number | null;
  isOpen: boolean;
  createdAt?: Date | Timestamp | null,
  updatedAt?: Date | Timestamp | null,
  createdBy?: string,
  updatedBy?: string
}
