
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        setProducts(data);
      }
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error.message);
      toast.error('Não foi possível carregar os produtos');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setProducts([...products, data[0]]);
        return data[0];
      }
    } catch (error: any) {
      console.error('Erro ao adicionar produto:', error.message);
      toast.error('Não foi possível adicionar o produto');
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setProducts(products.map(p => p.id === id ? data[0] : p));
        return data[0];
      }
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error.message);
      toast.error('Não foi possível atualizar o produto');
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(products.filter(p => p.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error.message);
      toast.error('Não foi possível excluir o produto');
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
