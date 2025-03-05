
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
  CalendarDays, 
  Calendar, 
  CalendarClock,
  Download
} from "lucide-react";

// Sample data for charts
const dailyData = [
  { date: "20/06", sales: 9, revenue: 810 },
  { date: "21/06", sales: 12, revenue: 1080 },
  { date: "22/06", sales: 15, revenue: 1350 },
  { date: "23/06", sales: 25, revenue: 2250 },
  { date: "24/06", sales: 18, revenue: 1620 },
  { date: "25/06", sales: 22, revenue: 1980 },
  { date: "26/06", sales: 28, revenue: 2520 },
];

const weeklyData = [
  { week: "Semana 1", sales: 45, revenue: 4050 },
  { week: "Semana 2", sales: 52, revenue: 4680 },
  { week: "Semana 3", sales: 68, revenue: 6120 },
  { week: "Semana 4", sales: 75, revenue: 6750 },
];

const monthlyData = [
  { month: "Jan", sales: 120, revenue: 10800 },
  { month: "Fev", sales: 150, revenue: 13500 },
  { month: "Mar", sales: 180, revenue: 16200 },
  { month: "Abr", sales: 210, revenue: 18900 },
  { month: "Mai", sales: 240, revenue: 21600 },
  { month: "Jun", sales: 300, revenue: 27000 },
];

const ticketTypesData = [
  { name: "Adulto", value: 60 },
  { name: "Criança", value: 25 },
  { name: "Estudante", value: 35 },
  { name: "Idoso", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("daily");

  const getActiveData = () => {
    switch (activeTab) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const getXAxisKey = () => {
    switch (activeTab) {
      case "daily":
        return "date";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      default:
        return "date";
    }
  };

  const getReportTitle = () => {
    switch (activeTab) {
      case "daily":
        return "Relatório Diário";
      case "weekly":
        return "Relatório Semanal";
      case "monthly":
        return "Relatório Mensal";
      default:
        return "Relatório";
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-ice-900">Relatórios</h1>
        <p className="text-ice-600 mt-1">Visualize os relatórios de vendas e desempenho do negócio.</p>
      </div>
      
      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Diário</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Semanal</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Mensal</span>
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>
        
        <TabsContent value="daily" className="mt-0">
          <ReportContent data={dailyData} xAxisKey="date" title="Relatório Diário" />
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-0">
          <ReportContent data={weeklyData} xAxisKey="week" title="Relatório Semanal" />
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-0">
          <ReportContent data={monthlyData} xAxisKey="month" title="Relatório Mensal" />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-ice-900 mb-4">Distribuição de Vendas por Tipo de Ingresso</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ticketTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-ice-900 mb-4">Resumo de Vendas</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-ice-50 p-4 rounded-lg">
                <p className="text-ice-500 text-sm">Total de Ingressos</p>
                <p className="text-ice-900 text-2xl font-bold mt-1">540</p>
              </div>
              <div className="bg-ice-50 p-4 rounded-lg">
                <p className="text-ice-500 text-sm">Receita Total</p>
                <p className="text-ice-900 text-2xl font-bold mt-1">R$ 48.600</p>
              </div>
            </div>
            
            <div className="bg-ice-50 p-4 rounded-lg">
              <p className="text-ice-500 text-sm">Ticket Médio</p>
              <p className="text-ice-900 text-2xl font-bold mt-1">R$ 90,00</p>
            </div>
            
            <div className="bg-ice-50 p-4 rounded-lg">
              <p className="text-ice-500 text-sm">Evento Mais Vendido</p>
              <p className="text-ice-900 text-xl font-bold mt-1">Festival de Inverno</p>
              <p className="text-ice-500 text-sm">210 ingressos (38.9%)</p>
            </div>
            
            <div className="bg-ice-50 p-4 rounded-lg">
              <p className="text-ice-500 text-sm">Melhor Dia de Vendas</p>
              <p className="text-ice-900 text-xl font-bold mt-1">23/06/2023</p>
              <p className="text-ice-500 text-sm">28 ingressos (R$ 2.520)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ReportContent = ({ data, xAxisKey, title }) => {
  return (
    <Card className="glass-card p-6">
      <h3 className="text-lg font-semibold text-ice-900 mb-4">{title}</h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" name="Ingressos Vendidos" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" name="Receita (R$)" fill="#64748b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default Reports;
