
import { useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './AuthContext';
import { 
  User, 
  ADMIN_USER, 
  ADMIN_PASSWORD, 
  USER_STORAGE_KEY, 
  USERS_STORAGE_KEY,
  ROLE_PERMISSIONS
} from './types';

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ id: string; username: string; password: string; role: string }[]>([
    { id: ADMIN_USER.id, username: ADMIN_USER.username, password: ADMIN_PASSWORD, role: "admin" }
  ]);

  // Check for existing session on load
  useEffect(() => {
    // Load user from local storage
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    // Load users from local storage
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        // Only set if admin user exists to ensure we don't lose the admin
        if (parsedUsers.some((u: any) => u.id === ADMIN_USER.id)) {
          setUsers(parsedUsers);
        } else {
          // Ensure admin user is always present
          setUsers(prev => {
            const updatedUsers = [...parsedUsers];
            if (!updatedUsers.some(u => u.id === ADMIN_USER.id)) {
              updatedUsers.push({ 
                id: ADMIN_USER.id, 
                username: ADMIN_USER.username, 
                password: ADMIN_PASSWORD, 
                role: "admin" 
              });
            }
            return updatedUsers;
          });
        }
      } catch (error) {
        console.error("Error parsing stored users:", error);
      }
    } else {
      // Initialize users in localStorage if it doesn't exist
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    
    setLoading(false);
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => 
      u.username === username && u.password === password
    );
    
    if (foundUser) {
      const loggedInUser = {
        id: foundUser.id,
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

  // Get all users (admin only)
  const getUsers = () => {
    if (!isAdmin()) {
      return [];
    }
    
    return users.map(({ id, username, role }) => ({ id, username, role }));
  };

  // Delete user (admin only)
  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!isAdmin()) {
      toast.error("Apenas administradores podem excluir usuários");
      return false;
    }

    // Prevent deleting admin user
    if (userId === ADMIN_USER.id) {
      toast.error("Não é possível excluir o usuário Administrador");
      return false;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success("Usuário excluído com sucesso");
    return true;
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
    
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      password,
      role
    };
    
    setUsers(prev => [...prev, newUser]);
    toast.success(`Usuário ${username} criado com sucesso`);
    return true;
  };

  // Check if user has specific permission
  const hasPermission = (permission: "dashboard" | "reports" | "sales" | "customers" | "products" | "ticketSales" | "rinkManager"): boolean => {
    if (!user) return false;
    
    const userRole = user.role;
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAdmin,
      createUser,
      deleteUser,
      getUsers,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
