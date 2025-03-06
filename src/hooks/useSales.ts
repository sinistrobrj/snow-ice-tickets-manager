
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sale, SaleItem, Product, Customer } from '@/types/database.types';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

interface NewSale {
  customer: string;
  items: CartItem[];
  total: number;
}

export const useSales = () => {
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

  const addSale = async (newSale: NewSale) => {
    try {
      // Iniciar uma transação
      // 1. Adicionar a venda
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([{
          customer: newSale.customer,
          total: newSale.total,
          date: new Date().toLocaleDateString('pt-BR')
        }])
        .select();

      if (saleError) {
        throw saleError;
      }

      if (!saleData || saleData.length === 0) {
        throw new Error('Falha ao criar venda');
      }

      const saleId = saleData[0].id;

      // 2. Adicionar os itens da venda
      const saleItemsPromises = newSale.items.map(item => {
        return supabase
          .from('sale_items')
          .insert([{
            sale_id: saleId,
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category
          }]);
      });

      // 3. Atualizar o estoque dos produtos
      const productUpdatesPromises = newSale.items.map(item => {
        return supabase
          .from('products')
          .update({ stock: item.stock - item.quantity })
          .eq('id', item.id);
      });

      // Executar todas as operações
      await Promise.all([...saleItemsPromises, ...productUpdatesPromises]);

      // 4. Atualizar o último cliente que comprou e incrementar ingressos
      if (newSale.customer) {
        // Contar quantos ingressos foram comprados
        const ticketCount = newSale.items
          .filter(item => item.category === 'ingresso')
          .reduce((sum, item) => sum + item.quantity, 0);
        
        if (ticketCount > 0) {
          // Chamar a função de incremento no banco de dados
          const { data: incrementData, error: incrementError } = await supabase
            .rpc('increment', {
              row_id: newSale.customer,
              increment_amount: ticketCount
            });
            
          if (incrementError) {
            console.error('Erro ao incrementar ingressos:', incrementError);
          } else {
            console.log('Ingressos incrementados:', incrementData);
          }
        }
        
        // Atualizar a data da última compra
        await supabase
          .from('customers')
          .update({ 
            last_purchase: new Date().toISOString()
          })
          .eq('id', newSale.customer);
      }

      // Atualizar o estado
      const newSaleWithId: Sale = {
        ...saleData[0],
        customer: newSale.customer,
        total: newSale.total,
        date: new Date().toLocaleDateString('pt-BR')
      };
      
      setSales([newSaleWithId, ...sales]);
      
      // Adicionar os itens ao estado
      const newItems = newSale.items.map(item => ({
        id: crypto.randomUUID(),
        sale_id: saleId,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      }));
      
      setSaleItems(prev => ({
        ...prev,
        [saleId]: newItems
      }));

      toast.success('Venda registrada com sucesso!');
      return saleData[0];
    } catch (error: any) {
      console.error('Erro ao adicionar venda:', error.message);
      toast.error('Não foi possível registrar a venda');
      return null;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      // Primeiro, excluir itens relacionados
      const { error: itemsError } = await supabase
        .from('sale_items')
        .delete()
        .eq('sale_id', id);

      if (itemsError) {
        throw itemsError;
      }

      // Depois, excluir a venda
      const { error: saleError } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (saleError) {
        throw saleError;
      }

      setSales(sales.filter(s => s.id !== id));
      
      // Remover os itens do estado
      const newSaleItems = { ...saleItems };
      delete newSaleItems[id];
      setSaleItems(newSaleItems);
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir venda:', error.message);
      toast.error('Não foi possível excluir a venda');
      return false;
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    saleItems,
    loading,
    fetchSales,
    fetchSaleItems,
    addSale,
    deleteSale
  };
};
