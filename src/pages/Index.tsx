
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Snowflake } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // If already logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        toast.error("Nome de usuário ou senha incorretos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Ocorreu um erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-ice-50 to-snow-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-ice-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2 text-snow-800 font-semibold text-xl">
              <Snowflake className="h-6 w-6 text-snow-600" />
              <span>Snow on Ice</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full p-8 animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-semibold text-ice-900">Login do Sistema</h1>
            <p className="text-ice-600 mt-1">Entre com suas credenciais para acessar</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-ice-700">
                Nome de Usuário
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome de usuário"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-ice-700">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-snow-600 hover:bg-snow-700"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm text-ice-600 mt-2">
              <p>Credenciais padrão:</p>
              <p>Usuário: Administrador</p>
              <p>Senha: 101010</p>
            </div>
          </form>
        </Card>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-ice-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-ice-500">© 2023 Snow on Ice. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
