
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Snowflake, BarChart3, Users, Ticket } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-ice-50 to-snow-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-ice-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2 text-snow-800 font-semibold text-xl">
              <Snowflake className="h-6 w-6 text-snow-600" />
              <span>Snow on Ice</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="nav-link text-ice-600 font-medium">Início</Link>
              <Link to="/dashboard" className="nav-link text-ice-600 font-medium">Sistema</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ice-900 tracking-tight animate-slide-down">
              Sistema de Gerenciamento
            </h1>
            <p className="mt-6 text-xl text-ice-600 max-w-3xl mx-auto animate-slide-down" style={{ animationDelay: "200ms" }}>
              Controle completo para vendas de ingressos, cadastro de clientes, e relatórios detalhados para sua empresa.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-down" style={{ animationDelay: "400ms" }}>
              <Link to="/dashboard">
                <Button className="w-full sm:w-auto bg-snow-600 hover:bg-snow-700 text-lg px-8 py-6">
                  Acessar Sistema
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white/70 backdrop-blur-sm border-t border-b border-ice-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-ice-900 text-center mb-12">Principais Funcionalidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card hover-card p-6 rounded-xl flex flex-col items-center text-center">
                <div className="p-4 bg-snow-100 rounded-lg text-snow-600 mb-4">
                  <Ticket className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-ice-900 mb-2">Vendas de Ingressos</h3>
                <p className="text-ice-600">Gerencie todas as vendas de ingressos para seus eventos com facilidade e eficiência.</p>
              </div>
              
              <div className="glass-card hover-card p-6 rounded-xl flex flex-col items-center text-center">
                <div className="p-4 bg-snow-100 rounded-lg text-snow-600 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-ice-900 mb-2">Cadastro de Clientes</h3>
                <p className="text-ice-600">Mantenha um registro completo dos seus clientes e todo o histórico de compras.</p>
              </div>
              
              <div className="glass-card hover-card p-6 rounded-xl flex flex-col items-center text-center">
                <div className="p-4 bg-snow-100 rounded-lg text-snow-600 mb-4">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-ice-900 mb-2">Relatórios Detalhados</h3>
                <p className="text-ice-600">Visualize estatísticas e relatórios por dia, semana e mês para tomar decisões informadas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-ice-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-snow-800 font-semibold text-xl mb-4">
            <Snowflake className="h-6 w-6 text-snow-600" />
            <span>Snow on Ice</span>
          </div>
          <p className="text-ice-500">© 2023 Snow on Ice. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
