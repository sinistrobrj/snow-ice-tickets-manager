
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Package, Ticket } from "lucide-react";
import { toast } from "sonner";

// Modelos de dados
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: "produto" | "ingresso";
}

// Dados iniciais
const initialProducts: Product[] = [
  { id: 1, name: "Chocolate Quente", description: "Bebida quente com chocolate e marshmallow", price: 15, stock: 100, category: "produto" },
  { id: 2, name: "Luvas de Patinação", description: "Luvas térmicas para patinação", price: 45, stock: 30, category: "produto" },
  { id: 3, name: "Cachecol Snow on Ice", description: "Cachecol oficial do evento", price: 35, stock: 50, category: "produto" },
  { id: 4, name: "Ingresso Adulto", description: "Entrada para adultos", price: 90, stock: 200, category: "ingresso" },
  { id: 5, name: "Ingresso Criança", description: "Entrada para crianças", price: 45, stock: 200, category: "ingresso" },
  { id: 6, name: "Ingresso Estudante", description: "Entrada para estudantes", price: 60, stock: 200, category: "ingresso" },
  { id: 7, name: "Ingresso Idoso", description: "Entrada para idosos", price: 60, stock: 200, category: "ingresso" },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "produto"
  });
  const [activeTab, setActiveTab] = useState("todos");

  // Filtrar produtos com base na busca e na categoria selecionada
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "todos") return matchesSearch;
    if (activeTab === "produtos") return matchesSearch && product.category === "produto";
    if (activeTab === "ingressos") return matchesSearch && product.category === "ingresso";
    
    return matchesSearch;
  });

  // Adicionar novo produto
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      const product: Product = {
        ...newProduct,
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
      };
      
      setProducts([...products, product]);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "produto"
      });
      
      toast.success("Produto adicionado com sucesso!");
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  // Salvar produto editado
  const handleSaveEdit = () => {
    if (editingProduct && editingProduct.name && editingProduct.price > 0) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      toast.success("Produto atualizado com sucesso!");
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  // Deletar produto
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Produto removido com sucesso!");
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-ice-900">Produtos e Ingressos</h1>
        <p className="text-ice-600 mt-1">Gerencie todos os produtos e ingressos disponíveis.</p>
      </div>
      
      <div className="flex justify-between flex-col md:flex-row gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ice-400" />
            <Input 
              placeholder="Buscar produtos..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
              <TabsTrigger value="ingressos">Ingressos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-snow-600 hover:bg-snow-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Item</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo produto ou ingresso.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoria
                </Label>
                <select 
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value as "produto" | "ingresso"})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="produto">Produto</option>
                  <option value="ingresso">Ingresso</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Preço (R$)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Estoque
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddProduct}>Adicionar</Button>
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
                <th className="pb-3 text-ice-500 font-medium">Descrição</th>
                <th className="pb-3 text-ice-500 font-medium">Categoria</th>
                <th className="pb-3 text-ice-500 font-medium">Preço</th>
                <th className="pb-3 text-ice-500 font-medium">Estoque</th>
                <th className="pb-3 text-ice-500 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-ice-100 hover:bg-ice-50 transition-colors">
                  <td className="py-3 text-ice-800">{product.name}</td>
                  <td className="py-3 text-ice-800">{product.description}</td>
                  <td className="py-3 text-ice-800">
                    {product.category === "produto" ? (
                      <span className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        Produto
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Ticket className="h-4 w-4 mr-1" />
                        Ingresso
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-ice-800">R$ {product.price.toFixed(2)}</td>
                  <td className="py-3 text-ice-800">{product.stock}</td>
                  <td className="py-3 text-ice-500">
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Editar Item</DialogTitle>
                            <DialogDescription>
                              Atualize os detalhes do item.
                            </DialogDescription>
                          </DialogHeader>
                          {editingProduct && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-category" className="text-right">
                                  Categoria
                                </Label>
                                <select 
                                  id="edit-category"
                                  value={editingProduct.category}
                                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value as "produto" | "ingresso"})}
                                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                  <option value="produto">Produto</option>
                                  <option value="ingresso">Ingresso</option>
                                </select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Nome
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-description" className="text-right">
                                  Descrição
                                </Label>
                                <Input
                                  id="edit-description"
                                  value={editingProduct.description}
                                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-price" className="text-right">
                                  Preço (R$)
                                </Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={editingProduct.price}
                                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-stock" className="text-right">
                                  Estoque
                                </Label>
                                <Input
                                  id="edit-stock"
                                  type="number"
                                  min="0"
                                  value={editingProduct.stock}
                                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-ice-500">
                    Nenhum item encontrado.
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

export default Products;
