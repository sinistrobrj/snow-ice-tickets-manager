
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types/database.types";
import CustomerDialog from "./CustomerDialog";
import CustomerSearchBar from "./CustomerSearchBar";
import CustomerList from "./CustomerList";

const Customers = () => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
  });
  
  const resetForm = () => {
    setCurrentCustomer({
      name: "",
      email: "",
      phone: "",
    });
    setIsEditing(false);
  };
  
  const handleSaveCustomer = async () => {
    if (currentCustomer.name && currentCustomer.email && currentCustomer.phone) {
      try {
        if (isEditing && currentCustomer.id) {
          // Update existing customer
          const updated = await updateCustomer(currentCustomer.id, {
            name: currentCustomer.name,
            email: currentCustomer.email,
            phone: currentCustomer.phone,
          });
          
          if (updated) {
            toast.success("Cliente atualizado com sucesso!");
            setDialogOpen(false);
          }
        } else {
          // Add new customer
          const newCustomer = await addCustomer({
            name: currentCustomer.name,
            email: currentCustomer.email,
            phone: currentCustomer.phone,
            tickets: 0,
            last_purchase: null,
            registration_date: new Date().toLocaleDateString('pt-BR'),
          });
          
          if (newCustomer) {
            toast.success("Cliente cadastrado com sucesso!");
            setDialogOpen(false);
          }
        }
      } catch (error) {
        console.error("Erro ao salvar cliente:", error);
        toast.error("Erro ao salvar cliente. Tente novamente.");
      }
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
    }
  };
  
  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  const handleDeleteCustomer = async (id: string) => {
    const success = await deleteCustomer(id);
    if (success) {
      toast.success("Cliente removido com sucesso!");
    }
  };

  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-snow-600" />
        <span className="ml-2 text-ice-600">Carregando clientes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-ice-900">Clientes</h1>
        <p className="text-ice-600 mt-1">Gerencie todos os clientes cadastrados no sistema.</p>
      </div>
      
      <CustomerSearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddNew={handleAddNew}
      />
      
      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentCustomer={currentCustomer}
        isEditing={isEditing}
        onSave={handleSaveCustomer}
        setCurrentCustomer={setCurrentCustomer}
      />
      
      <CustomerList
        customers={customers}
        searchTerm={searchTerm}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />
    </div>
  );
};

export default Customers;
