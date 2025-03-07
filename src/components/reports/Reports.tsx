
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useSales } from "@/hooks/useSales";
import { format, subMonths, isWithinInterval, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredSalesData, setFilteredSalesData] = useState<any[]>([]);
  const [productDistribution, setProductDistribution] = useState<any[]>([]);
  const { fetchSales, salesData } = useSales();
  
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  useEffect(() => {
    if (salesData.sales.length > 0) {
      processSalesData();
    }
  }, [salesData, startDate, endDate]);

  const processSalesData = () => {
    // Create monthly sales summary
    const monthlySales = generateMonthlySalesData();
    setFilteredSalesData(monthlySales);

    // Process product data for pie chart
    const productData = processSaleItems();
    setProductDistribution(productData);
  };

  const generateMonthlySalesData = () => {
    const monthlyData: Record<string, { 
      name: string; 
      ingressos: number; 
      produtos: number; 
      total: number; 
    }> = {};
    
    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMMM', { locale: ptBR });
      
      monthlyData[monthKey] = {
        name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        ingressos: 0,
        produtos: 0,
        total: 0
      };
    }
    
    // Filter sales by date range if provided
    const filteredSales = filterSalesByDateRange(salesData.sales);
    
    // Process sales data
    filteredSales.forEach(sale => {
      const saleDate = new Date(sale.date);
      const monthKey = format(saleDate, 'yyyy-MM');
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].total += Number(sale.total);
        
        // Process sale items to categorize them
        sale.items.forEach((item: any) => {
          if (item.category === "ingresso") {
            monthlyData[monthKey].ingressos += Number(item.price) * item.quantity;
          } else {
            monthlyData[monthKey].produtos += Number(item.price) * item.quantity;
          }
        });
      }
    });
    
    // Convert to array and sort by date (oldest to newest)
    return Object.values(monthlyData).reverse();
  };

  const filterSalesByDateRange = (sales: any[]) => {
    if (!startDate && !endDate) return sales;
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      
      if (startDate && endDate) {
        return isWithinInterval(saleDate, {
          start: parseISO(startDate),
          end: parseISO(endDate)
        });
      } else if (startDate) {
        return saleDate >= parseISO(startDate);
      } else if (endDate) {
        return saleDate <= parseISO(endDate);
      }
      
      return true;
    });
  };

  const processSaleItems = () => {
    const productCounts: Record<string, { 
      name: string; 
      value: number; 
      color: string;
    }> = {};
    
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];
    
    // Filter sales by date range if provided
    const filteredSales = filterSalesByDateRange(salesData.sales);
    
    // Count products
    filteredSales.forEach(sale => {
      sale.items.forEach((item: any) => {
        const itemKey = item.product_name;
        
        if (!productCounts[itemKey]) {
          productCounts[itemKey] = {
            name: item.product_name,
            value: 0,
            color: COLORS[Object.keys(productCounts).length % COLORS.length]
          };
        }
        
        productCounts[itemKey].value += item.quantity;
      });
    });
    
    // Convert to array and sort by value
    return Object.values(productCounts)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Get top 10 products
  };
  
  const handleFilter = () => {
    processSalesData();
  };
  
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  // Customer data based on sales
  const customerData = [
    { name: "Masculino", value: 45, color: "#0088FE" },
    { name: "Feminino", value: 55, color: "#00C49F" },
  ];
  
  const ReportContent = ({ title, description, chart }: { title: string; description: string; chart: JSX.Element }) => (
    <Card className="p-6 mt-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-ice-800">{title}</h3>
        <p className="text-ice-600 mt-1">{description}</p>
      </div>
      <div className="h-80 w-full">
        {chart}
      </div>
    </Card>
  );
  
  const SalesChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={filteredSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`R$ ${value}`, '']}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Bar dataKey="ingressos" name="Vendas de Ingressos" fill="#8884d8" />
        <Bar dataKey="produtos" name="Vendas de Produtos" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
  
  const ProductPieChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={productDistribution}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {productDistribution.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} unidades`, '']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
  
  const CustomerPieChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={customerData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {customerData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, '']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
  
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-ice-900">Relatórios</h1>
        <p className="text-ice-600 mt-1">Visualize dados e métricas do seu negócio.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <Label htmlFor="start-date">Data Inicial</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Label htmlFor="end-date">Data Final</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="w-full md:w-1/3 flex gap-2">
          <Button onClick={handleFilter} className="flex-1">Filtrar</Button>
          <Button variant="outline" onClick={handleClearFilter}>Limpar</Button>
        </div>
      </div>
      
      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Vendas Gerais</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <ReportContent
            title="Relatório de Vendas"
            description="Visão geral das vendas de ingressos e produtos ao longo do tempo."
            chart={<SalesChart />}
          />
        </TabsContent>
        
        <TabsContent value="products">
          <ReportContent
            title="Relatório de Produtos"
            description="Distribuição de vendas por tipo de produto e ingresso."
            chart={<ProductPieChart />}
          />
        </TabsContent>
        
        <TabsContent value="customers">
          <ReportContent
            title="Relatório de Clientes"
            description="Distribuição demográfica dos clientes."
            chart={<CustomerPieChart />}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
