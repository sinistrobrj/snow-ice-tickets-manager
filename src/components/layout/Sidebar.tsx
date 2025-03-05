
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  BarChart3, 
  LogOut, 
  Snowflake,
  ShoppingCart,
  Package
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Ponto de Venda",
      path: "/sales",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Vendas de Ingressos",
      path: "/ticket-sales",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      name: "Produtos e Estoque",
      path: "/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      path: "/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Relatórios",
      path: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-ice-200 shadow-sm z-10">
      <div className="p-6">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 text-snow-800 font-semibold text-xl"
        >
          <Snowflake className="h-6 w-6 text-snow-600" />
          <span>Snow on Ice</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 pb-6">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-snow-100 text-snow-700"
                    : "text-ice-600 hover:bg-ice-50 hover:text-snow-700"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-4 pb-6">
        <div className="border-t border-ice-200 pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-ice-600 hover:bg-ice-50 hover:text-snow-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
