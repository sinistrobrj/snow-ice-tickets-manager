
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TicketSale } from '@/types/database.types';
import { toast } from 'sonner';

interface NewTicketSale {
  customer: string;
  event: string;
  eventDate: string;
  ticketType: string;
  tickets: number;
  total: number;
}

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

  const addTicketSale = async (sale: NewTicketSale) => {
    try {
      const { data, error } = await supabase
        .from('ticket_sales')
        .insert([{
          customer: sale.customer,
          event: sale.event,
          event_date: sale.eventDate,
          ticket_type: sale.ticketType,
          tickets: sale.tickets,
          total: sale.total,
          date: new Date().toLocaleDateString('pt-BR')
        }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setTicketSales([data[0], ...ticketSales]);
        
        // Atualizar o cliente
        await supabase
          .from('customers')
          .update({ 
            last_purchase: new Date().toLocaleDateString('pt-BR'),
            tickets: supabase.rpc('increment_customer_tickets', { 
              customer_id: sale.customer,
              ticket_count: sale.tickets
            })
          })
          .eq('id', sale.customer);

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

      setTicketSales(ticketSales.filter(ts => ts.id !== id));
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
