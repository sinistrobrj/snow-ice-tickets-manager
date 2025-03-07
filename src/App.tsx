
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth";
import RequireAuth from "@/components/auth/RequireAuth";
import LoginPage from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import TicketSalesPage from "./pages/TicketSalesPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import RinkManagerPage from "./pages/RinkManagerPage";
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
              <RequireAuth requiredPermission="dashboard">
                <DashboardPage />
              </RequireAuth>
            } />
            <Route path="/ticket-sales" element={
              <RequireAuth requiredPermission="ticketSales">
                <TicketSalesPage />
              </RequireAuth>
            } />
            <Route path="/customers" element={
              <RequireAuth requiredPermission="customers">
                <CustomersPage />
              </RequireAuth>
            } />
            <Route path="/reports" element={
              <RequireAuth requiredPermission="reports">
                <ReportsPage />
              </RequireAuth>
            } />
            <Route path="/products" element={
              <RequireAuth requiredPermission="products">
                <ProductsPage />
              </RequireAuth>
            } />
            <Route path="/sales" element={
              <RequireAuth requiredPermission="sales">
                <SalesPage />
              </RequireAuth>
            } />
            <Route path="/rink-manager" element={
              <RequireAuth requiredPermission="rinkManager">
                <RinkManagerPage />
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
