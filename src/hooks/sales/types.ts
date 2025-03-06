
import { Sale, SaleItem, Product, Customer } from '@/types/database.types';

export interface CartItem extends Product {
  quantity: number;
}

export interface NewSale {
  customer: string;
  items: CartItem[];
  total: number;
}
