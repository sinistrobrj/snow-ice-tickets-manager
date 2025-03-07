
// Define user type
export interface User {
  id: string;
  username: string;
  role: string;
}

// Define context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  createUser: (username: string, password: string, role: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getUsers: () => { id: string; username: string; role: string }[];
  hasPermission: (permission: "dashboard" | "reports" | "sales" | "customers" | "products" | "ticketSales" | "rinkManager") => boolean;
}

// Role permission mapping
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  "admin": ["dashboard", "reports", "sales", "customers", "products", "ticketSales", "rinkManager"],
  "user": ["sales", "customers", "products", "ticketSales"],
  "funcionario": ["sales", "customers", "products", "ticketSales", "rinkManager"],
  "analise": ["dashboard", "reports"]
};

// Initial admin user
export const ADMIN_USER = { 
  id: "admin-id", 
  username: "Administrador", 
  role: "admin" 
};
export const ADMIN_PASSWORD = "101010";

// Local storage keys
export const USER_STORAGE_KEY = 'snow_on_ice_user';
export const USERS_STORAGE_KEY = 'snow_on_ice_users';
