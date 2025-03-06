
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sale, SaleItem } from '@/types/database.types';
import { toast } from 'sonner';

export const useSalesFetch = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [saleItems, setSaleItems] = useState<Record<string, SaleItem[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setSales(data);
        
        // Buscar itens para todas as vendas
        for (const sale of data) {
          await fetchSaleItems(sale.id);
        }
      }
    } catch (error: any) {
      console.error('Erro ao buscar vendas:', error.message);
      toast.error('Não foi possível carregar as vendas');
    } finally {
      setLoading(false);
    }
  };

  const fetchSaleItems = async (saleId: string) => {
    try {
      const { data, error } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', saleId);

      if (error) {
        throw error;
      }

      if (data) {
        setSaleItems(prev => ({
          ...prev,
          [saleId]: data
        }));
        return data;
      }
    } catch (error: any) {
      console.error(`Erro ao buscar itens da venda ${saleId}:`, error.message);
      return [];
    }
  };

  return {
    sales,
    saleItems,
    loading,
    setSales,
    setSaleItems,
    fetchSales,
    fetchSaleItems
  };
};
