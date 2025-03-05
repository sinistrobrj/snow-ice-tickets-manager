
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  last_purchase: string | null;
  registration_date: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: "produto" | "ingresso";
  created_at: string;
}

export interface Sale {
  id: string;
  customer: string;
  total: number;
  date: string;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  category: "produto" | "ingresso";
}

export interface TicketSale {
  id: string;
  customer: string;
  event: string;
  event_date: string;
  tickets: number;
  ticket_type: string;
  total: number;
  date: string;
  created_at: string;
}
