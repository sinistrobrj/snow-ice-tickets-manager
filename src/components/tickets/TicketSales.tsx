
import { useState, useEffect } from "react";
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
import { Plus, Search, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTicketSales } from "@/hooks/useTicketSales";
import { useCustomers } from "@/hooks/useCustomers";

const ticketTypes = [
  { id: 1, name: "Adulto", price: 90 },
  { id: 2, name: "Criança", price: 45 },
  { id: 3, name: "Estudante", price: 60 },
  { id: 4, name: "Idoso", price: 60 },
];

const events = [
  { id: 1, name: "Festival de Inverno", date: "30/06/2023" },
  { id: 2, name: "Apresentação de Patinação", date: "05/07/2023" },
  { id: 3, name: "Competição Regional", date: "12/07/2023" },
];

const TicketSales = () => {
  const { ticketSales: sales, loading, addTicketSale, deleteTicketSale } = useTicketSales();
  const { customers, loading: loadingCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [newSale, setNewSale] = useState({
    customer: "",
    event: "",
    ticketType: "",
    tickets: 1,
  });
  
  const handleAddSale = async () => {
    const selectedEvent = events.find(e => e.name === newSale.event);
    const selectedTicketType = ticketTypes.find(t => t.name === newSale.ticketType);
    
    if (newSale.customer && newSale.event && newSale.ticketType && newSale.tickets > 0 && selectedEvent && selectedTicketType) {
      const ticketSale = {
        customer: newSale.customer,
        event: newSale.event,
        event_date: new Date(selectedEvent.date.split('/').reverse().join('-')).toISOString(),
        tickets: newSale.tickets,
        ticket_type: newSale.ticketType,
        total: selectedTicketType.price * newSale.tickets,
        date: new Date().toISOString()
      };
      
      const result = await addTicketSale(ticketSale);
      
      if (result) {
        setNewSale({
          customer: "",
          event: "",
          ticketType: "",
          tickets: 1,
        });
        
        toast.success("Venda registrada com sucesso!");
      }
    } else {
      toast.error("Por favor, preencha todos os campos corretamente.");
    }
  };
  
  const handleDeleteSale = async (id: string) => {
    const success = await deleteTicketSale(id);
    if (success) {
      toast.success("Venda removida com sucesso!");
    }
  };
  
  const filteredSales = sales.filter(sale => {
    const customer = customers.find(c => c.id === sale.customer);
    return customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sale.event.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading || loadingCustomers) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-snow-600" />
        <span className="ml-2 text-ice-600">Carregando dados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-ice-900">Vendas de Ingressos</h1>
        <p className="text-ice-600 mt-1">Gerencie todas as vendas de ingressos para os eventos.</p>
      </div>
      
      <div className="flex justify-between flex-col md:flex-row gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ice-400" />
          <Input 
            placeholder="Buscar por cliente ou evento..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-snow-600 hover:bg-snow-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Nova Venda</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer" className="text-right">
                  Cliente
                </Label>
                <select
                  id="customer"
                  value={newSale.customer}
                  onChange={(e) => setNewSale({...newSale, customer: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event" className="text-right">
                  Evento
                </Label>
                <select 
                  id="event"
                  value={newSale.event}
                  onChange={(e) => setNewSale({...newSale, event: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione um evento</option>
                  {events.map(event => (
                    <option key={event.id} value={event.name}>{event.name} - {event.date}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ticketType" className="text-right">
                  Tipo
                </Label>
                <select 
                  id="ticketType"
                  value={newSale.ticketType}
                  onChange={(e) => setNewSale({...newSale, ticketType: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione um tipo</option>
                  {ticketTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name} - R$ {type.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tickets" className="text-right">
                  Quantidade
                </Label>
                <Input
                  id="tickets"
                  type="number"
                  min="1"
                  value={newSale.tickets}
                  onChange={(e) => setNewSale({...newSale, tickets: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddSale}>Registrar Venda</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="glass-card p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-ice-200">
                <th className="pb-3 text-ice-500 font-medium">Cliente</th>
                <th className="pb-3 text-ice-500 font-medium">Evento</th>
                <th className="pb-3 text-ice-500 font-medium">Data Evento</th>
                <th className="pb-3 text-ice-500 font-medium">Tipo</th>
                <th className="pb-3 text-ice-500 font-medium">Quantidade</th>
                <th className="pb-3 text-ice-500 font-medium">Total</th>
                <th className="pb-3 text-ice-500 font-medium">Data Compra</th>
                <th className="pb-3 text-ice-500 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => {
                const customer = customers.find(c => c.id === sale.customer);
                const eventDate = new Date(sale.event_date).toLocaleDateString('pt-BR');
                const saleDate = new Date(sale.date).toLocaleDateString('pt-BR');
                
                return (
                  <tr key={sale.id} className="border-b border-ice-100 hover:bg-ice-50 transition-colors">
                    <td className="py-3 text-ice-800">{customer ? customer.name : 'Cliente desconhecido'}</td>
                    <td className="py-3 text-ice-800">{sale.event}</td>
                    <td className="py-3 text-ice-800">{eventDate}</td>
                    <td className="py-3 text-ice-800">{sale.ticket_type}</td>
                    <td className="py-3 text-ice-800">{sale.tickets}</td>
                    <td className="py-3 text-ice-800">R$ {sale.total.toFixed(2)}</td>
                    <td className="py-3 text-ice-500">{saleDate}</td>
                    <td className="py-3 text-ice-500">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteSale(sale.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-ice-500">
                    Nenhuma venda de ingresso encontrada.
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

export default TicketSales;
