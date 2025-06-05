import { Timestamp } from 'firebase/firestore';

export interface Box {
  id?: string;
  sellerId: string;
  openingDate: Date | Timestamp;
  closingDate?: Date | Timestamp | null;
  isOpen: boolean;
  initialAmount: number;
  systemAmount?: number | null;
  cashAmount?: number | null;
  difference?: number | null;
  sales?: number;
  createdAt?: Date | Timestamp | null,
  updatedAt?: Date | Timestamp | null,
  createdBy?: string,
  updatedBy?: string
}
