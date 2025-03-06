
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Customer } from "@/types/database.types";
import { toast } from "sonner";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCustomer: Partial<Customer>;
  isEditing: boolean;
  onSave: () => void;
  setCurrentCustomer: (customer: Partial<Customer>) => void;
}

const CustomerDialog = ({
  open,
  onOpenChange,
  currentCustomer,
  isEditing,
  onSave,
  setCurrentCustomer
}: CustomerDialogProps) => {
  const [cpfError, setCpfError] = useState<string>("");

  const validateCpf = (cpf: string) => {
    // Remove any non-numeric characters
    const numericCpf = cpf.replace(/\D/g, '');
    
    if (numericCpf.length !== 11) {
      return "CPF deve conter exatamente 11 dígitos numéricos";
    }
    
    return "";
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    const numericValue = value.replace(/\D/g, '');
    
    setCurrentCustomer({...currentCustomer, phone: numericValue});
    setCpfError(validateCpf(numericValue));
  };

  const handleSave = () => {
    const error = validateCpf(currentCustomer.phone || "");
    if (error) {
      setCpfError(error);
      toast.error(error);
      return;
    }
    
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={currentCustomer.name || ""}
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
              value={currentCustomer.email || ""}
              onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cpf" className="text-right">
              CPF
            </Label>
            <div className="col-span-3">
              <Input
                id="cpf"
                value={currentCustomer.phone || ""}
                onChange={handleCpfChange}
                maxLength={11}
                placeholder="Somente números (11 dígitos)"
                className={cpfError ? "border-red-500" : ""}
              />
              {cpfError && <p className="text-red-500 text-sm mt-1">{cpfError}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            {isEditing ? "Atualizar" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
