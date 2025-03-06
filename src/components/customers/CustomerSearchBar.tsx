
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

interface CustomerSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddNew: () => void;
}

const CustomerSearchBar = ({ searchTerm, setSearchTerm, onAddNew }: CustomerSearchBarProps) => {
  return (
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
      
      <Button className="bg-snow-600 hover:bg-snow-700" onClick={onAddNew}>
        <UserPlus className="h-4 w-4 mr-2" />
        Novo Cliente
      </Button>
    </div>
  );
};

export default CustomerSearchBar;
