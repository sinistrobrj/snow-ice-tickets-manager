
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { Customer } from "@/types/database.types";

interface CustomerListProps {
  customers: Customer[];
  searchTerm: string;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerList = ({ customers, searchTerm, onEdit, onDelete }: CustomerListProps) => {
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
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
                        onClick={() => onEdit(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(customer.id)}
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
  );
};

export default CustomerList;
