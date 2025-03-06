
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
            <Label htmlFor="phone" className="text-right">
              Telefone
            </Label>
            <Input
              id="phone"
              value={currentCustomer.phone || ""}
              onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave}>
            {isEditing ? "Atualizar" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
