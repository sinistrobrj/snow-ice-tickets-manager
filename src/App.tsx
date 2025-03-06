
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import RequireAuth from "@/components/auth/RequireAuth";
import LoginPage from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import TicketSalesPage from "./pages/TicketSalesPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import NotFound from "./pages/NotFound";

// Criamos o queryClient para gerenciar estados da aplicação
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } />
            <Route path="/ticket-sales" element={
              <RequireAuth>
                <TicketSalesPage />
              </RequireAuth>
            } />
            <Route path="/customers" element={
              <RequireAuth>
                <CustomersPage />
              </RequireAuth>
            } />
            <Route path="/reports" element={
              <RequireAuth>
                <ReportsPage />
              </RequireAuth>
            } />
            <Route path="/products" element={
              <RequireAuth>
                <ProductsPage />
              </RequireAuth>
            } />
            <Route path="/sales" element={
              <RequireAuth>
                <SalesPage />
              </RequireAuth>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
