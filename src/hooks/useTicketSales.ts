
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TicketSale } from '@/types/database.types';
import { toast } from 'sonner';

export const useTicketSales = () => {
  const [ticketSales, setTicketSales] = useState<TicketSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTicketSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ticket_sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setTicketSales(data);
      }
    } catch (error: any) {
      console.error('Erro ao buscar vendas de ingressos:', error.message);
      toast.error('Não foi possível carregar as vendas de ingressos');
    } finally {
      setLoading(false);
    }
  };

  const addTicketSale = async (ticketSale: Omit<TicketSale, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ticket_sales')
        .insert([ticketSale])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setTicketSales([data[0], ...ticketSales]);
        
        // Atualizar o número de ingressos do cliente
        await supabase
          .from('customers')
          .update({ 
            tickets: supabase.rpc('increment', { 
              row_id: ticketSale.customer,
              increment_amount: ticketSale.tickets
            }),
            last_purchase: new Date().toISOString()
          })
          .eq('id', ticketSale.customer);
        
        return data[0];
      }
    } catch (error: any) {
      console.error('Erro ao adicionar venda de ingresso:', error.message);
      toast.error('Não foi possível registrar a venda de ingresso');
      return null;
    }
  };

  const deleteTicketSale = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ticket_sales')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTicketSales(ticketSales.filter(sale => sale.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir venda de ingresso:', error.message);
      toast.error('Não foi possível excluir a venda de ingresso');
      return false;
    }
  };

  useEffect(() => {
    fetchTicketSales();
  }, []);

  return {
    ticketSales,
    loading,
    fetchTicketSales,
    addTicketSale,
    deleteTicketSale
  };
};
