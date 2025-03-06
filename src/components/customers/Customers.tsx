
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types/database.types";

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
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

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
      
      <div className="flex justify-between flex-col md:flex-row gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ice-400" />
          <Input 
            placeholder="Buscar por nome, email ou telefone..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-snow-600 hover:bg-snow-700" onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Cliente" : "Cadastrar Novo Cliente"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={currentCustomer.name}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={currentCustomer.email}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={currentCustomer.phone}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveCustomer}>
                {isEditing ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="glass-card p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-ice-200">
                <th className="pb-3 text-ice-500 font-medium">Nome</th>
                <th className="pb-3 text-ice-500 font-medium">Email</th>
                <th className="pb-3 text-ice-500 font-medium">Telefone</th>
                <th className="pb-3 text-ice-500 font-medium">Ingressos</th>
                <th className="pb-3 text-ice-500 font-medium">Última Compra</th>
                <th className="pb-3 text-ice-500 font-medium">Cadastro</th>
                <th className="pb-3 text-ice-500 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-ice-100 hover:bg-ice-50 transition-colors">
                    <td className="py-3 text-ice-800">{customer.name}</td>
                    <td className="py-3 text-ice-800">{customer.email}</td>
                    <td className="py-3 text-ice-800">{customer.phone}</td>
                    <td className="py-3 text-ice-800">{customer.tickets}</td>
                    <td className="py-3 text-ice-500">{customer.last_purchase || '-'}</td>
                    <td className="py-3 text-ice-500">{customer.registration_date}</td>
                    <td className="py-3 text-ice-500">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-snow-600 hover:text-snow-800 hover:bg-snow-50"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-ice-500">
                    {searchTerm ? 'Nenhum cliente encontrado com os critérios de busca.' : 'Nenhum cliente cadastrado.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Customers;
