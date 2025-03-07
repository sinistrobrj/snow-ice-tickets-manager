
import { Customer } from '@/types/database.types';

// Re-export these types from database.types.ts
export interface Sale {
  id: string;
  customer: string;
  amount: number;
  total: number;
  date: string;
  created_at: string;
  status: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  quantity: number;
  stock: number;
}

export interface NewSale {
  customer: string;
  items: CartItem[];
  total: number;
}
