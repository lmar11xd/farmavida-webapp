import { UserRolEnum } from "../enums/user-rol.enum";

export interface User {
    id?: string;
    username: string;
    names: string;
    phone?: string;
    email: string;
    password: string;
    role: UserRolEnum;
  }