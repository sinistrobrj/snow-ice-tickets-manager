
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import UserManagementDialog from "@/components/users/UserManagementDialog";
import { Button } from "@/components/ui/button";
import { UserPlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAdmin, logout } = useAuth();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-ice-50 to-snow-50">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="page-container">
          {isAdmin() && (
            <div className="flex justify-end gap-2 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-snow-600"
                onClick={() => setUserDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          )}
          <div className="page-transition">{children}</div>
        </div>
      </main>
      
      {isAdmin() && (
        <UserManagementDialog
          open={userDialogOpen}
          onOpenChange={setUserDialogOpen}
        />
      )}
    </div>
  );
};

export default Layout;
