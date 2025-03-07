
import { useState, useEffect } from 'react';
import { Sale, SaleItem, NewSale } from './sales/types';

// Interface for the return value of useSales
interface SalesData {
  sales: Sale[];
  saleItems: Record<string, SaleItem[]>;
  loading: boolean;
  salesData: {
    sales: Sale[];
  };
  fetchSales: () => Promise<void>;
  fetchSaleItems: (saleId: string) => Promise<SaleItem[]>;
  addSale: (newSale: NewSale) => Promise<string>;
  deleteSale: (id: string) => Promise<boolean>;
}

export const useSales = (): SalesData => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [saleItems, setSaleItems] = useState<Record<string, SaleItem[]>>({});
  const [loading, setLoading] = useState(true);

  // Fetch sales from local storage or initialize
  const fetchSales = async (): Promise<void> => {
    setLoading(true);
    try {
      const storedSales = localStorage.getItem('sales');
      if (storedSales) {
        setSales(JSON.parse(storedSales));
      } else {
        // Initialize with empty array if no sales exist
        localStorage.setItem('sales', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sale items for a specific sale
  const fetchSaleItems = async (saleId: string): Promise<SaleItem[]> => {
    if (saleItems[saleId]) {
      return saleItems[saleId];
    }
    
    // If items aren't cached, get them from the sale
    const sale = sales.find(s => s.id === saleId);
    if (sale && sale.items) {
      const items = sale.items as unknown as SaleItem[];
      setSaleItems(prev => ({ ...prev, [saleId]: items }));
      return items;
    }
    
    return [];
  };

  // Add a new sale
  const addSale = async (newSale: NewSale): Promise<string> => {
    const saleId = `sale-${Date.now()}`;
    const sale: Sale = {
      id: saleId,
      ...newSale,
      date: new Date().toISOString(),
    };
    
    const updatedSales = [...sales, sale];
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    
    return saleId;
  };

  // Delete a sale
  const deleteSale = async (id: string): Promise<boolean> => {
    const updatedSales = sales.filter(sale => sale.id !== id);
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    return true;
  };

  // Load sales on initial mount
  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    saleItems,
    loading,
    salesData: { sales },
    fetchSales,
    fetchSaleItems,
    addSale,
    deleteSale,
  };
};
