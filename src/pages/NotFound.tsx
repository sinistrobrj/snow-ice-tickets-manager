
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Snowflake } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-ice-50 to-snow-50 px-4">
      <div className="text-center glass-card p-8 rounded-xl animate-fade-in max-w-md w-full">
        <Snowflake className="h-12 w-12 text-snow-600 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-ice-900 mb-4">404</h1>
        <p className="text-xl text-ice-600 mb-8">Oops! Página não encontrada</p>
        <Link to="/dashboard">
          <Button className="w-full bg-snow-600 hover:bg-snow-700">
            Voltar para o Dashboard
          </Button>
        </Link>
        <Link to="/" className="block mt-4 text-snow-600 hover:text-snow-800 transition-colors">
          Ou voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
