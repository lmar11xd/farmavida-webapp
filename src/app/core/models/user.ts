import { Timestamp } from '@angular/fire/firestore';
import { UserRolEnum } from "../enums/user-rol.enum";

export interface User {
    id?: string;
    username: string;
    names: string;
    phone?: string;
    email: string;
    password: string;
    role: UserRolEnum;
    authentication: boolean;
    createdAt?: Date | Timestamp | null,
    updatedAt?: Date | Timestamp | null,
    createdBy?: string,
    updatedBy?: string
  }
