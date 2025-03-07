
import { Product, Customer } from '@/types/database.types';
import { Sale, SaleItem } from '@/types/database.types';

export type { Sale, SaleItem };

export interface CartItem extends Product {
  quantity: number;
}

export interface NewSale {
  customer: string;
  items: CartItem[];
  total: number;
}
