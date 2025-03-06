
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Snowflake } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ice-50 to-snow-50 p-4">
      <Card className="glass-card max-w-md w-full p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-snow-800 font-semibold text-2xl mb-2">
            <Snowflake className="h-7 w-7 text-snow-600" />
            <span>Snow on Ice</span>
          </div>
          <h1 className="text-xl font-semibold text-ice-900">Login do Sistema</h1>
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
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
