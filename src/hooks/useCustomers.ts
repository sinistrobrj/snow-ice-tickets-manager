
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Customer } from '@/types/database.types';
import { toast } from 'sonner';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setCustomers(data);
      }
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error.message);
      toast.error('Não foi possível carregar os clientes');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          ...customer,
          registration_date: new Date().toLocaleDateString('pt-BR'),
          tickets: 0,
          last_purchase: null
        }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setCustomers([data[0], ...customers]);
        return data[0];
      }
    } catch (error: any) {
      console.error('Erro ao adicionar cliente:', error.message);
      toast.error('Não foi possível adicionar o cliente');
      return null;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setCustomers(customers.map(c => c.id === id ? data[0] : c));
        return data[0];
      }
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error.message);
      toast.error('Não foi possível atualizar o cliente');
      return null;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCustomers(customers.filter(c => c.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error.message);
      toast.error('Não foi possível excluir o cliente');
      return false;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
};
