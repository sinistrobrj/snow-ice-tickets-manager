
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Trash2 } from "lucide-react";

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserManagementDialog = ({
  open,
  onOpenChange
}: UserManagementDialogProps) => {
  const { createUser, getUsers, deleteUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [usersList, setUsersList] = useState<Array<{id: string; username: string; role: string}>>([]);
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  useEffect(() => {
    if (open) {
      setUsersList(getUsers());
    }
  }, [open, getUsers]);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setRole("user");
  };

  const handleSave = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const success = await createUser(username, password, role);
      if (success) {
        resetForm();
        setUsersList(getUsers());
        setActiveTab("list");
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário. Tente novamente.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      const success = await deleteUser(userId);
      if (success) {
        setUsersList(getUsers());
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerenciamento de Usuários</DialogTitle>
        </DialogHeader>

        <div className="flex border-b border-ice-200 mb-4">
          <button
            className={`px-4 py-2 ${activeTab === "create" ? "border-b-2 border-snow-600 font-medium" : "text-ice-600"}`}
            onClick={() => setActiveTab("create")}
          >
            Cadastrar Novo
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "list" ? "border-b-2 border-snow-600 font-medium" : "text-ice-600"}`}
            onClick={() => setActiveTab("list")}
          >
            Listar Usuários
          </button>
        </div>

        {activeTab === "create" ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Usuário
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Função
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="funcionario">Funcionário</SelectItem>
                  <SelectItem value="analise">Análise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleSave}>
                Cadastrar
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-2">
            <div className="grid grid-cols-3 font-medium text-ice-700 pb-2 mb-2 border-b">
              <div>Usuário</div>
              <div>Função</div>
              <div className="text-right">Ações</div>
            </div>
            
            {usersList.length === 0 ? (
              <p className="text-center py-4 text-ice-500">Nenhum usuário encontrado</p>
            ) : (
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {usersList.map((user) => (
                  <div key={user.id} className="grid grid-cols-3 items-center py-2 border-b border-ice-100">
                    <div className="font-medium">{user.username}</div>
                    <div className="capitalize">{
                      user.role === "admin" ? "Administrador" :
                      user.role === "funcionario" ? "Funcionário" :
                      user.role === "analise" ? "Análise" : "Usuário"
                    }</div>
                    <div className="text-right">
                      {user.username !== "Administrador" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
