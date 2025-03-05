
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
import { Plus, Search, Edit, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  lastPurchase: string;
  registrationDate: string;
}

const initialCustomers: Customer[] = [
  { id: 1, name: "Maria Silva", email: "maria@example.com", phone: "(11) 98765-4321", tickets: 12, lastPurchase: "24/06/2023", registrationDate: "15/01/2023" },
  { id: 2, name: "João Oliveira", email: "joao@example.com", phone: "(11) 91234-5678", tickets: 8, lastPurchase: "23/06/2023", registrationDate: "20/01/2023" },
  { id: 3, name: "Ana Santos", email: "ana@example.com", phone: "(11) 99876-5432", tickets: 5, lastPurchase: "23/06/2023", registrationDate: "05/02/2023" },
  { id: 4, name: "Pedro Costa", email: "pedro@example.com", phone: "(11) 98765-1234", tickets: 10, lastPurchase: "22/06/2023", registrationDate: "12/02/2023" },
  { id: 5, name: "Carla Ferreira", email: "carla@example.com", phone: "(11) 91234-8765", tickets: 3, lastPurchase: "22/06/2023", registrationDate: "18/02/2023" },
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    tickets: 0,
    lastPurchase: "",
    registrationDate: "",
  });
  
  const resetForm = () => {
    setCurrentCustomer({
      id: 0,
      name: "",
      email: "",
      phone: "",
      tickets: 0,
      lastPurchase: "",
      registrationDate: "",
    });
    setIsEditing(false);
  };
  
  const handleSaveCustomer = () => {
    if (currentCustomer.name && currentCustomer.email && currentCustomer.phone) {
      if (isEditing) {
        // Update existing customer
        setCustomers(customers.map(c => 
          c.id === currentCustomer.id ? currentCustomer : c
        ));
        toast.success("Cliente atualizado com sucesso!");
      } else {
        // Add new customer
        const newCustomer = {
          ...currentCustomer,
          id: customers.length + 1,
          tickets: 0,
          lastPurchase: "-",
          registrationDate: new Date().toLocaleDateString('pt-BR'),
        };
        setCustomers([newCustomer, ...customers]);
        toast.success("Cliente cadastrado com sucesso!");
      }
      resetForm();
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
    }
  };
  
  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditing(true);
  };
  
  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    toast.success("Cliente removido com sucesso!");
  };
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

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
        
        <Dialog onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button className="bg-snow-600 hover:bg-snow-700">
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-ice-100 hover:bg-ice-50 transition-colors">
                  <td className="py-3 text-ice-800">{customer.name}</td>
                  <td className="py-3 text-ice-800">{customer.email}</td>
                  <td className="py-3 text-ice-800">{customer.phone}</td>
                  <td className="py-3 text-ice-800">{customer.tickets}</td>
                  <td className="py-3 text-ice-500">{customer.lastPurchase}</td>
                  <td className="py-3 text-ice-500">{customer.registrationDate}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Customers;
