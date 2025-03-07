
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface Cliente {
  entrada: Date;
  saida: Date;
  tempo: number;
  pausado: boolean;
  tempoPausado: number;
  momentoPausa: Date | null;
}

const RinkManagerPage = () => {
  const [clientes, setClientes] = useState<Record<string, Cliente>>({});
  const [contadorClientes, setContadorClientes] = useState(0);
  const [numeroCliente, setNumeroCliente] = useState<string>('');
  const [tempoPatinaçao, setTempoPatinaçao] = useState<string>('30');

  useEffect(() => {
    // Load data from localStorage if available
    const savedClientes = localStorage.getItem('rink_clientes');
    if (savedClientes) {
      try {
        const parsedClientes: Record<string, any> = JSON.parse(savedClientes);
        // Convert date strings back to Date objects
        const processedClientes: Record<string, Cliente> = {};
        
        for (const key in parsedClientes) {
          processedClientes[key] = {
            ...parsedClientes[key],
            entrada: new Date(parsedClientes[key].entrada),
            saida: new Date(parsedClientes[key].saida),
            momentoPausa: parsedClientes[key].momentoPausa ? new Date(parsedClientes[key].momentoPausa) : null
          };
        }
        
        setClientes(processedClientes);
        setContadorClientes(Object.keys(processedClientes).length);
      } catch (error) {
        console.error('Error loading rink clients data:', error);
        toast.error('Erro ao carregar dados dos clientes');
      }
    }

    // Set up interval for updating the list
    const interval = setInterval(() => {
      updateClientsList();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save to localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem('rink_clientes', JSON.stringify(clientes));
  }, [clientes]);

  const atualizarContador = (count: number) => {
    setContadorClientes(count);
  };

  const registrarEntrada = () => {
    if (!numeroCliente || parseInt(numeroCliente) < 1 || parseInt(numeroCliente) > 999) {
      toast.error('Número de cliente inválido. Use números entre 1 e 999.');
      return;
    }

    const tempo = parseInt(tempoPatinaçao);
    const agora = new Date();
    
    setClientes(prevClientes => {
      const newClientes = { ...prevClientes };
      
      if (newClientes[numeroCliente]) {
        const tempoRestante = newClientes[numeroCliente].saida.getTime() - agora.getTime();
        const novoTempo = tempoRestante + tempo * 60000;
        newClientes[numeroCliente].saida = new Date(agora.getTime() + novoTempo);
        newClientes[numeroCliente].tempo += tempo;
        toast.success(`Tempo adicional registrado para o cliente ${numeroCliente}. Novo tempo total: ${newClientes[numeroCliente].tempo} minutos.`);
      } else {
        newClientes[numeroCliente] = {
          entrada: agora,
          saida: new Date(agora.getTime() + tempo * 60000),
          tempo: tempo,
          pausado: false,
          tempoPausado: 0,
          momentoPausa: null
        };
        toast.success(`Cliente ${numeroCliente} registrado com sucesso. Tempo de patinação: ${tempo} minutos.`);
        atualizarContador(contadorClientes + 1);
      }
      
      return newClientes;
    });
    
    setNumeroCliente('');
  };

  const registrarSaida = () => {
    if (!numeroCliente) {
      toast.error('Informe o número do cliente');
      return;
    }

    if (clientes[numeroCliente]) {
      setClientes(prevClientes => {
        const newClientes = { ...prevClientes };
        delete newClientes[numeroCliente];
        return newClientes;
      });
      
      atualizarContador(contadorClientes - 1);
      toast.success(`Cliente ${numeroCliente} removido da pista de patinação.`);
      setNumeroCliente('');
    } else {
      toast.error(`Cliente ${numeroCliente} não encontrado na pista.`);
    }
  };

  const verificarCliente = () => {
    if (!numeroCliente) {
      toast.error('Informe o número do cliente');
      return;
    }

    if (clientes[numeroCliente]) {
      const cliente = clientes[numeroCliente];
      let tempoRestante;
      
      if (cliente.pausado) {
        tempoRestante = cliente.tempoPausado;
      } else {
        tempoRestante = cliente.saida.getTime() - new Date().getTime();
      }
      
      const minutos = Math.floor(tempoRestante / 60000);
      const segundos = Math.floor((tempoRestante % 60000) / 1000);
      
      toast.info(`Cliente ${numeroCliente}:
Entrada: ${cliente.entrada.toLocaleTimeString()}
Saída prevista: ${cliente.saida.toLocaleTimeString()}
Tempo total: ${cliente.tempo} minutos
Tempo restante: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}
Status: ${cliente.pausado ? 'Pausado' : 'Em andamento'}`);
    } else {
      toast.error(`Cliente ${numeroCliente} não encontrado na pista.`);
    }
  };

  const pausarRetomar = () => {
    const agora = new Date();
    
    if (numeroCliente) {
      // Pausar/retomar cliente específico
      if (clientes[numeroCliente]) {
        setClientes(prevClientes => {
          const newClientes = { ...prevClientes };
          const cliente = newClientes[numeroCliente];
          
          if (cliente.pausado) {
            // Retomando o tempo
            const tempoPausado = agora.getTime() - (cliente.momentoPausa?.getTime() || 0);
            cliente.saida = new Date(cliente.saida.getTime() + tempoPausado);
            cliente.pausado = false;
            cliente.momentoPausa = null;
            toast.success(`Tempo retomado para o cliente ${numeroCliente}.`);
          } else {
            // Pausando o tempo
            cliente.tempoPausado = cliente.saida.getTime() - agora.getTime();
            cliente.pausado = true;
            cliente.momentoPausa = agora;
            toast.success(`Tempo pausado para o cliente ${numeroCliente}.`);
          }
          
          return newClientes;
        });
      } else {
        toast.error(`Cliente ${numeroCliente} não encontrado na pista.`);
      }
    } else {
      // Pausar/retomar todos os clientes
      setClientes(prevClientes => {
        const newClientes = { ...prevClientes };
        
        let todosJaPausados = true;
        for (let numero in newClientes) {
          if (!newClientes[numero].pausado) {
            todosJaPausados = false;
            break;
          }
        }
        
        for (let numero in newClientes) {
          const cliente = newClientes[numero];
          if (todosJaPausados) {
            // Retomando o tempo para todos
            const tempoPausado = agora.getTime() - (cliente.momentoPausa?.getTime() || 0);
            cliente.saida = new Date(cliente.saida.getTime() + tempoPausado);
            cliente.pausado = false;
            cliente.momentoPausa = null;
          } else {
            // Pausando o tempo para todos
            cliente.tempoPausado = cliente.saida.getTime() - agora.getTime();
            cliente.pausado = true;
            cliente.momentoPausa = agora;
          }
        }
        
        if (todosJaPausados) {
          toast.success("Tempo retomado para todos os clientes.");
        } else {
          toast.success("Tempo pausado para todos os clientes.");
        }
        
        return newClientes;
      });
    }
  };

  const updateClientsList = () => {
    // This function will force a component re-render to update times
    setClientes(prevClientes => ({ ...prevClientes }));
  };

  return (
    <Layout>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-snow-700">Gerenciador de Patinação no Gelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6 text-lg font-semibold">
              Total de clientes no Snow On Ice: {contadorClientes}
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="numero-cliente" className="whitespace-nowrap">
                    Número do Cliente (1-999):
                  </Label>
                  <Input 
                    id="numero-cliente" 
                    type="number" 
                    min="1" 
                    max="999"
                    value={numeroCliente}
                    onChange={(e) => setNumeroCliente(e.target.value)}
                    className="w-24"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="tempo-patinacao" className="whitespace-nowrap">
                    Tempo de Patinação:
                  </Label>
                  <RadioGroup 
                    value={tempoPatinaçao} 
                    onValueChange={setTempoPatinaçao}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="30" id="30min" />
                      <Label htmlFor="30min">30 minutos</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="60" id="60min" />
                      <Label htmlFor="60min">60 minutos</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={registrarEntrada}>Registrar Entrada</Button>
                <Button onClick={registrarSaida} variant="destructive">Registrar Saída</Button>
                <Button onClick={verificarCliente} variant="outline">Verificar Cliente</Button>
                <Button onClick={pausarRetomar} variant="secondary">Pausar/Retomar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes no Snow On Ice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-ice-200 bg-snow-100 p-2 text-left">Cliente</th>
                    <th className="border border-ice-200 bg-snow-100 p-2 text-left">Entrada</th>
                    <th className="border border-ice-200 bg-snow-100 p-2 text-left">Saída</th>
                    <th className="border border-ice-200 bg-snow-100 p-2 text-left">Tempo Restante</th>
                    <th className="border border-ice-200 bg-snow-100 p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(clientes).map(([numero, cliente]) => {
                    const agora = new Date();
                    let tempoRestante;
                    
                    if (cliente.pausado) {
                      tempoRestante = cliente.tempoPausado;
                    } else {
                      tempoRestante = cliente.saida.getTime() - agora.getTime();
                    }
                    
                    const minutos = Math.floor(tempoRestante / 60000);
                    const segundos = Math.floor((tempoRestante % 60000) / 1000);
                    const tempoFormatado = tempoRestante >= 0 
                      ? `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`
                      : `-${Math.abs(minutos)}:${Math.abs(segundos) < 10 ? '0' : ''}${Math.abs(segundos)}`;
                      
                    return (
                      <tr key={numero} className={cliente.pausado ? "bg-red-100" : (parseInt(numero) % 2 === 0 ? "bg-ice-50" : "")}>
                        <td className="border border-ice-200 p-2">Cliente {numero}</td>
                        <td className="border border-ice-200 p-2">{cliente.entrada.toLocaleTimeString()}</td>
                        <td className="border border-ice-200 p-2">{cliente.saida.toLocaleTimeString()}</td>
                        <td className="border border-ice-200 p-2">{tempoFormatado}</td>
                        <td className="border border-ice-200 p-2">{cliente.pausado ? 'Pausado' : 'Em andamento'}</td>
                      </tr>
                    );
                  })}
                  {Object.keys(clientes).length === 0 && (
                    <tr>
                      <td colSpan={5} className="border border-ice-200 p-4 text-center text-muted-foreground">
                        Nenhum cliente registrado na pista
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RinkManagerPage;
