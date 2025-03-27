import { Product } from "./product";

export interface Sale {
    id?: string,
    products: Product[],
    total: number,
    saleDate: Date
}