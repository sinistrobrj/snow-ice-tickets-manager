
import { useEffect } from 'react';
import { useSalesFetch } from './useSalesFetch';
import { useSaleOperations } from './useSaleOperations';

export const useSales = () => {
  const {
    sales,
    saleItems,
    loading,
    setSales,
    setSaleItems,
    fetchSales,
    fetchSaleItems
  } = useSalesFetch();

  const { addSale, deleteSale } = useSaleOperations(
    sales,
    setSales,
    saleItems,
    setSaleItems
  );

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

// Re-export types for convenience
export * from './types';
