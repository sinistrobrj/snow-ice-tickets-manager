
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Exemplo de dados para os relatórios
  const salesData = [
    { name: "Janeiro", ingressos: 120, produtos: 85, total: 18500 },
    { name: "Fevereiro", ingressos: 150, produtos: 98, total: 22800 },
    { name: "Março", ingressos: 180, produtos: 120, total: 27300 },
    { name: "Abril", ingressos: 250, produtos: 160, total: 38200 },
    { name: "Maio", ingressos: 310, produtos: 210, total: 47500 },
  ];
  
  const productSalesData = [
    { name: "Ingresso Adulto", value: 450, color: "#0088FE" },
    { name: "Ingresso Criança", value: 300, color: "#00C49F" },
    { name: "Ingresso Estudante", value: 200, color: "#FFBB28" },
    { name: "Ingresso Idoso", value: 150, color: "#FF8042" },
    { name: "Chocolate Quente", value: 320, color: "#8884d8" },
    { name: "Luvas de Patinação", value: 180, color: "#82ca9d" },
    { name: "Cachecol", value: 220, color: "#ffc658" },
  ];
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];
  
  const customerData = [
    { name: "Masculino", value: 45, color: "#0088FE" },
    { name: "Feminino", value: 55, color: "#00C49F" },
  ];
  
  const ReportContent = ({ title, description, chart }) => (
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
      <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          data={productSalesData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {productSalesData.map((entry, index) => (
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
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Label htmlFor="start-date">Data Inicial</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="w-full md:w-1/2">
          <Label htmlFor="end-date">Data Final</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1"
          />
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
