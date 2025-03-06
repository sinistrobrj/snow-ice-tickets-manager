
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Define user type
interface User {
  id: string;
  username: string;
  role: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  createUser: (username: string, password: string, role: string) => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  isAdmin: () => false,
  createUser: async () => false,
});

// Initial admin user
const ADMIN_USER = { 
  id: "admin-id", 
  username: "Administrador", 
  role: "admin" 
};
const ADMIN_PASSWORD = "101010";

// Local storage keys
const USER_STORAGE_KEY = 'snow_on_ice_user';

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ username: string; password: string; role: string }[]>([
    { username: ADMIN_USER.username, password: ADMIN_PASSWORD, role: "admin" }
  ]);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => 
      u.username === username && u.password === password
    );
    
    if (foundUser) {
      const loggedInUser = {
        id: foundUser.username === ADMIN_USER.username ? ADMIN_USER.id : `user-${Date.now()}`,
        username: foundUser.username,
        role: foundUser.role
      };
      
      setUser(loggedInUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success("Logout realizado com sucesso");
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };

  // Create new user (admin only)
  const createUser = async (username: string, password: string, role: string): Promise<boolean> => {
    if (!isAdmin()) {
      toast.error("Apenas administradores podem criar novos usuários");
      return false;
    }
    
    if (users.some(u => u.username === username)) {
      toast.error("Este nome de usuário já está em uso");
      return false;
    }
    
    setUsers(prev => [...prev, { username, password, role }]);
    toast.success(`Usuário ${username} criado com sucesso`);
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAdmin,
      createUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
