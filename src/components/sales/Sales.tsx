
import { useState, useEffect } from "react";
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
import { Plus, Search, ShoppingCart, Minus, Package, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomers";
import { useSales } from "@/hooks/useSales";
import { Product, Customer, Sale, SaleItem } from "@/types/database.types";

interface CartItem extends Product {
  quantity: number;
}

const Sales = () => {
  const { products, loading: loadingProducts } = useProducts();
  const { customers, loading: loadingCustomers } = useCustomers();
  const { sales, saleItems, loading: loadingSales, addSale, deleteSale } = useSales();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
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
  const removeFromCart = (productId: string) => {
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
  const completeSale = async () => {
    if (cart.length === 0) {
      toast.error("O carrinho está vazio");
      return;
    }
    
    if (!selectedCustomerId) {
      toast.error("Por favor, selecione um cliente");
      return;
    }
    
    const success = await addSale({
      customer: selectedCustomerId,
      items: cart,
      total: cartTotal
    });
    
    if (success) {
      setCart([]);
      setSelectedCustomerId("");
    }
  };

  // Filtrar produtos disponíveis
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearch.toLowerCase()) &&
    product.stock > 0 // Só mostrar produtos com estoque
  );

  // Filtrar histórico de vendas
  const filteredSales = sales.filter(sale => {
    const customer = customers.find(c => c.id === sale.customer);
    return customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Estado de carregamento
  const loading = loadingProducts || loadingCustomers || loadingSales;

  if (loading) {
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
        <h1 className="text-3xl font-bold text-ice-900">Ponto de Venda</h1>
        <p className="text-ice-600 mt-1">Registre as vendas de produtos e ingressos.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Painel de vendas (3/5 das colunas) */}
        <Card className="glass-card p-6 col-span-1 lg:col-span-3">
          <div className="mb-4">
            <Label htmlFor="customer-name">Cliente</Label>
            <select
              id="customer-name"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
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
                              disabled={item.quantity >= item.stock}
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
            disabled={cart.length === 0 || !selectedCustomerId}
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
                    <div className="text-ice-500 mt-1">
                      R$ {product.price.toFixed(2)} • Estoque: {product.stock}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-ice-100 text-ice-700 hover:bg-ice-200"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
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
                    {filteredSales.map((sale) => {
                      const items = saleItems[sale.id] || [];
                      const customer = customers.find(c => c.id === sale.customer);
                      
                      return (
                        <tr key={sale.id} className="border-b border-ice-100 hover:bg-ice-50 transition-colors">
                          <td className="py-3 text-ice-800">{sale.id.substring(0, 8)}</td>
                          <td className="py-3 text-ice-800">{customer?.name || 'Cliente desconhecido'}</td>
                          <td className="py-3 text-ice-800">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="link" className="text-snow-600 p-0 h-auto">
                                  Ver {items.length} itens
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Detalhes da Venda #{sale.id.substring(0, 8)}</DialogTitle>
                                  <DialogDescription>
                                    Cliente: {customer?.name || 'Cliente desconhecido'} | Data: {sale.date}
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
                                      {items.map((item) => (
                                        <tr key={item.id} className="border-t border-ice-100">
                                          <td className="px-4 py-2">{item.product_name}</td>
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
                      );
                    })}
                    
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
