
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";
import { Plus, Search, ShoppingCart, Minus, Package, Ticket } from "lucide-react";
import { toast } from "sonner";

// Modelos de dados
interface Product {
  id: number;
  name: string;
  price: number;
  category: "produto" | "ingresso";
}

interface CartItem extends Product {
  quantity: number;
}

interface Sale {
  id: number;
  customer: string;
  items: CartItem[];
  total: number;
  date: string;
}

// Dados de exemplo
const availableProducts: Product[] = [
  { id: 1, name: "Chocolate Quente", price: 15, category: "produto" },
  { id: 2, name: "Luvas de Patinação", price: 45, category: "produto" },
  { id: 3, name: "Cachecol Snow on Ice", price: 35, category: "produto" },
  { id: 4, name: "Ingresso Adulto", price: 90, category: "ingresso" },
  { id: 5, name: "Ingresso Criança", price: 45, category: "ingresso" },
  { id: 6, name: "Ingresso Estudante", price: 60, category: "ingresso" },
  { id: 7, name: "Ingresso Idoso", price: 60, category: "ingresso" },
];

const initialSales: Sale[] = [
  { 
    id: 1, 
    customer: "Maria Silva", 
    items: [
      { id: 4, name: "Ingresso Adulto", price: 90, quantity: 2, category: "ingresso" },
      { id: 1, name: "Chocolate Quente", price: 15, quantity: 2, category: "produto" }
    ], 
    total: 210, 
    date: "02/05/2023" 
  },
  { 
    id: 2, 
    customer: "João Costa", 
    items: [
      { id: 5, name: "Ingresso Criança", price: 45, quantity: 3, category: "ingresso" },
      { id: 3, name: "Cachecol Snow on Ice", price: 35, quantity: 1, category: "produto" }
    ], 
    total: 170, 
    date: "03/05/2023" 
  },
];

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showSaleHistory, setShowSaleHistory] = useState(true);

  // Função para adicionar ao carrinho
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, quantity: item.quantity + 1} 
          : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
    
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  // Função para remover do carrinho
  const removeFromCart = (productId: number) => {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.id === productId 
          ? {...item, quantity: item.quantity - 1} 
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  // Calcular total do carrinho
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Completar a venda
  const completeSale = () => {
    if (cart.length === 0) {
      toast.error("O carrinho está vazio");
      return;
    }
    
    if (!customer) {
      toast.error("Por favor, informe o nome do cliente");
      return;
    }
    
    const newSale: Sale = {
      id: sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1,
      customer,
      items: [...cart],
      total: cartTotal,
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    setSales([newSale, ...sales]);
    setCart([]);
    setCustomer("");
    toast.success("Venda realizada com sucesso!");
  };

  // Filtrar produtos disponíveis
  const filteredProducts = availableProducts.filter(product => 
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtrar histórico de vendas
  const filteredSales = sales.filter(sale => 
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-ice-900">Ponto de Venda</h1>
        <p className="text-ice-600 mt-1">Registre as vendas de produtos e ingressos.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Painel de vendas (3/5 das colunas) */}
        <Card className="glass-card p-6 col-span-1 lg:col-span-3">
          <div className="mb-4">
            <Label htmlFor="customer-name">Nome do Cliente</Label>
            <Input 
              id="customer-name" 
              placeholder="Nome do cliente" 
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label>Carrinho de Compras</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCart([])}
                className="text-ice-500 hover:text-red-500"
              >
                Limpar
              </Button>
            </div>
            
            {cart.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-ice-50">
                    <tr className="text-left">
                      <th className="px-4 py-2 text-ice-500 font-medium">Item</th>
                      <th className="px-4 py-2 text-ice-500 font-medium">Preço</th>
                      <th className="px-4 py-2 text-ice-500 font-medium">Qtd</th>
                      <th className="px-4 py-2 text-ice-500 font-medium">Subtotal</th>
                      <th className="px-4 py-2 text-ice-500 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id} className="border-t border-ice-100">
                        <td className="px-4 py-3 text-ice-800">
                          <div className="flex items-center">
                            {item.category === "produto" ? 
                              <Package className="h-4 w-4 mr-2 text-ice-400" /> : 
                              <Ticket className="h-4 w-4 mr-2 text-ice-400" />
                            }
                            {item.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ice-800">R$ {item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-ice-800">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ice-800">R$ {(item.price * item.quantity).toFixed(2)}</td>
                        <td className="px-4 py-3 text-ice-800">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-red-500 hover:bg-red-50"
                            onClick={() => setCart(cart.filter(cartItem => cartItem.id !== item.id))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-ice-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-medium">Total:</td>
                      <td className="px-4 py-3 font-bold text-ice-900">R$ {cartTotal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-ice-500 border rounded-md border-dashed border-ice-200">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-ice-400" />
                <p>O carrinho está vazio</p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={completeSale} 
            disabled={cart.length === 0 || !customer}
            className="w-full bg-snow-600 hover:bg-snow-700 text-white py-6 text-lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Finalizar Venda - R$ {cartTotal.toFixed(2)}
          </Button>
        </Card>
        
        {/* Lista de produtos (2/5 das colunas) */}
        <Card className="glass-card p-6 col-span-1 lg:col-span-2">
          <div className="mb-4">
            <Label htmlFor="product-search">Produtos Disponíveis</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ice-400" />
              <Input 
                id="product-search" 
                placeholder="Buscar produtos..." 
                className="pl-10" 
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[400px]">
            <div className="grid grid-cols-1 gap-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-3 hover:bg-ice-50 rounded-md border border-ice-100">
                  <div>
                    <div className="flex items-center">
                      {product.category === "produto" ? 
                        <Package className="h-4 w-4 mr-2 text-ice-500" /> : 
                        <Ticket className="h-4 w-4 mr-2 text-snow-500" />
                      }
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-ice-500 mt-1">R$ {product.price.toFixed(2)}</div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-ice-100 text-ice-700 hover:bg-ice-200"
                    onClick={() => addToCart(product)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="p-6 text-center text-ice-500">
                  <p>Nenhum produto encontrado.</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Histórico de vendas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-ice-900">Histórico de Vendas</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowSaleHistory(!showSaleHistory)}
          >
            {showSaleHistory ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
        
        {showSaleHistory && (
          <>
            <div className="relative max-w-md w-full mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ice-400" />
              <Input 
                placeholder="Buscar por cliente..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Card className="glass-card p-6 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-ice-200">
                      <th className="pb-3 text-ice-500 font-medium">ID</th>
                      <th className="pb-3 text-ice-500 font-medium">Cliente</th>
                      <th className="pb-3 text-ice-500 font-medium">Itens</th>
                      <th className="pb-3 text-ice-500 font-medium">Total</th>
                      <th className="pb-3 text-ice-500 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="border-b border-ice-100 hover:bg-ice-50 transition-colors">
                        <td className="py-3 text-ice-800">{sale.id}</td>
                        <td className="py-3 text-ice-800">{sale.customer}</td>
                        <td className="py-3 text-ice-800">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="text-snow-600 p-0 h-auto">
                                Ver {sale.items.length} itens
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalhes da Venda #{sale.id}</DialogTitle>
                                <DialogDescription>
                                  Cliente: {sale.customer} | Data: {sale.date}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                <table className="w-full">
                                  <thead className="bg-ice-50">
                                    <tr className="text-left">
                                      <th className="px-4 py-2 text-ice-500 font-medium">Item</th>
                                      <th className="px-4 py-2 text-ice-500 font-medium">Preço</th>
                                      <th className="px-4 py-2 text-ice-500 font-medium">Qtd</th>
                                      <th className="px-4 py-2 text-ice-500 font-medium">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sale.items.map((item, index) => (
                                      <tr key={index} className="border-t border-ice-100">
                                        <td className="px-4 py-2">{item.name}</td>
                                        <td className="px-4 py-2">R$ {item.price.toFixed(2)}</td>
                                        <td className="px-4 py-2">{item.quantity}</td>
                                        <td className="px-4 py-2">R$ {(item.price * item.quantity).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-ice-50">
                                    <tr>
                                      <td colSpan={3} className="px-4 py-2 text-right font-medium">Total:</td>
                                      <td className="px-4 py-2 font-bold text-ice-900">R$ {sale.total.toFixed(2)}</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                        <td className="py-3 text-ice-800">R$ {sale.total.toFixed(2)}</td>
                        <td className="py-3 text-ice-500">{sale.date}</td>
                      </tr>
                    ))}
                    
                    {filteredSales.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-ice-500">
                          Nenhuma venda encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Sales;
