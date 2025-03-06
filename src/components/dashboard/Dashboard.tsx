
import { Card } from "@/components/ui/card";
import { 
  TicketCheck, 
  Users, 
  CreditCard, 
  TrendingUp 
} from "lucide-react";

const statCards = [
  {
    title: "Ingressos Vendidos",
    value: "0",
    change: "+0%",
    changeType: "increase",
    icon: <TicketCheck className="h-8 w-8 text-snow-500" />,
  },
  {
    title: "Clientes Ativos",
    value: "0",
    change: "+0%",
    changeType: "increase",
    icon: <Users className="h-8 w-8 text-snow-500" />,
  },
  {
    title: "Receita Total",
    value: "R$ 0",
    change: "+0%",
    changeType: "increase",
    icon: <CreditCard className="h-8 w-8 text-snow-500" />,
  },
  {
    title: "Taxa de Crescimento",
    value: "0%",
    change: "+0%",
    changeType: "increase",
    icon: <TrendingUp className="h-8 w-8 text-snow-500" />,
  },
];

const recentTransactions = [];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-ice-900">Dashboard</h1>
        <p className="text-ice-600 mt-1">Bem-vindo ao seu sistema de gerenciamento Snow on Ice.</p>
      </div>
      
      <div className="dashboard-stats">
        {statCards.map((stat, index) => (
          <Card key={index} className="glass-card hover-card p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-ice-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-3xl font-bold text-ice-900 mt-2">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-ice-400 text-sm ml-1">vs. mês anterior</span>
                </div>
              </div>
              <div className="p-3 bg-snow-50 rounded-lg">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card col-span-1 lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-ice-900 mb-4">Vendas Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-ice-200">
                  <th className="pb-3 text-ice-500 font-medium">Cliente</th>
                  <th className="pb-3 text-ice-500 font-medium">Ingressos</th>
                  <th className="pb-3 text-ice-500 font-medium">Total</th>
                  <th className="pb-3 text-ice-500 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-ice-100 hover:bg-ice-50 transition-colors">
                      <td className="py-3 text-ice-800">{transaction.customer}</td>
                      <td className="py-3 text-ice-800">{transaction.tickets}</td>
                      <td className="py-3 text-ice-800">{transaction.total}</td>
                      <td className="py-3 text-ice-500">{transaction.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-ice-500">
                      Nenhuma venda registrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-ice-900 mb-4">Próximos Eventos</h3>
          <div className="space-y-4">
            <div className="p-3 border border-ice-100 rounded-lg hover:border-snow-300 transition-colors cursor-pointer">
              <p className="text-ice-800 font-medium">Festival de Inverno</p>
              <p className="text-ice-500 text-sm">Aguardando agendamento</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
