"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  LogOut,
  Settings,
  CreditCard,
} from "lucide-react";

export default function MerchantDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Camisa Polo Masculina",
      description: "Camisa polo de alta qualidade, 100% algodão",
      price: 89.90,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=200&q=80",
    },
    {
      id: 2,
      name: "Vestido Floral Feminino",
      description: "Vestido leve e confortável, perfeito para o verão",
      price: 129.90,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  // Estado para configuração do PagBank
  const [pagbankConfig, setPagbankConfig] = useState({
    api_key: "",
    environment: "SANDBOX" as "SANDBOX" | "PRODUCTION",
    webhook_url: "",
    soft_descriptor: "AGRESTE",
    is_facilitador: false,
    sub_merchant_tax_id: "",
    sub_merchant_name: "",
    sub_merchant_reference_id: "",
    sub_merchant_mcc: "5691",
  });

  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    // Simular autenticação
    const isLoggedIn = localStorage.getItem("merchantLoggedIn");
    if (!isLoggedIn) {
      // Auto-login para demo
      localStorage.setItem("merchantLoggedIn", "true");
    }
    setIsAuthenticated(true);
    
    // Carregar configuração do PagBank
    loadPagBankConfig();
  }, []);

  const loadPagBankConfig = async () => {
    try {
      const response = await fetch('/api/pagbank/config');
      const data = await response.json();
      if (data.success && data.config) {
        setPagbankConfig(data.config);
        setConfigSaved(true);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const handleSavePagBankConfig = async () => {
    try {
      const response = await fetch('/api/pagbank/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pagbankConfig),
      });

      const data = await response.json();
      
      if (data.success) {
        setConfigSaved(true);
        alert('Configuração do PagBank salva com sucesso!');
      } else {
        alert('Erro ao salvar configuração: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      alert('Erro ao salvar configuração');
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          image: newProduct.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80",
        },
      ]);
      setNewProduct({ name: "", description: "", price: "", image: "" });
      setShowAddProduct(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("merchantLoggedIn");
    router.push("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: "Produtos",
      value: products.length,
      icon: Package,
      color: "#D4704A",
    },
    {
      title: "Pedidos Hoje",
      value: "12",
      icon: ShoppingBag,
      color: "#8B9D83",
    },
    {
      title: "Vendas do Mês",
      value: "R$ 3.450",
      icon: DollarSign,
      color: "#E8C468",
    },
    {
      title: "Crescimento",
      value: "+23%",
      icon: TrendingUp,
      color: "#D4704A",
    },
  ];

  const recentOrders = [
    { id: "#1234", customer: "Maria Silva", total: "R$ 219,80", status: "Pago" },
    { id: "#1233", customer: "João Santos", total: "R$ 89,90", status: "Pago" },
    { id: "#1232", customer: "Ana Costa", total: "R$ 159,90", status: "Pendente" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#D4704A]">Loja do Davi</h1>
              <p className="text-sm text-gray-600">Painel do Lojista</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/loja/davi")}
                variant="outline"
                className="border-[#8B9D83] text-[#8B9D83] hover:bg-[#8B9D83] hover:text-white"
              >
                Ver Minha Loja
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-[#D4704A] text-[#D4704A] hover:bg-[#D4704A] hover:text-white"
              >
                <LogOut size={18} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="pagamentos">
              <CreditCard size={16} className="mr-2" />
              Pagamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Products Section */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Meus Produtos</h2>
                  <Button
                    onClick={() => setShowAddProduct(!showAddProduct)}
                    className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                  >
                    <Plus size={18} className="mr-2" />
                    Adicionar Produto
                  </Button>
                </div>

                {showAddProduct && (
                  <Card className="p-6 bg-white mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Novo Produto
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome do Produto</Label>
                        <Input
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, name: e.target.value })
                          }
                          placeholder="Ex: Camisa Polo"
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, description: e.target.value })
                          }
                          placeholder="Descreva o produto..."
                        />
                      </div>
                      <div>
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, price: e.target.value })
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>URL da Imagem</Label>
                        <Input
                          value={newProduct.image}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, image: e.target.value })
                          }
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleAddProduct}
                          className="bg-[#8B9D83] hover:bg-[#7a8a74] text-white"
                        >
                          Salvar Produto
                        </Button>
                        <Button
                          onClick={() => setShowAddProduct(false)}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-4">
                  {products.map((product) => (
                    <Card key={product.id} className="p-4 bg-white">
                      <div className="flex gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {product.description}
                          </p>
                          <p className="text-lg font-bold text-[#D4704A] mt-1">
                            R$ {product.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Orders Section */}
              <div>
                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Pedidos Recentes
                  </h3>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="pb-4 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-gray-900">
                            {order.id}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              order.status === "Pago"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-sm font-bold text-[#D4704A] mt-1">
                          {order.total}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pagamentos">
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <Settings size={24} className="text-[#D4704A]" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configuração do PagBank</h2>
                  <p className="text-sm text-gray-600">Configure sua conta PagBank para receber pagamentos via PIX, Boleto e Cartão</p>
                </div>
              </div>

              {configSaved && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">✓ Configuração salva com sucesso!</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <Label htmlFor="api_key" className="text-base font-semibold">
                    Token de Acesso (API Key) *
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Obtenha seu token em: <a href="https://minhaconta.pagseguro.uol.com.br/preferencias/integracoes.jhtml" target="_blank" className="text-[#D4704A] underline">PagBank → Integrações</a>
                  </p>
                  <Input
                    id="api_key"
                    type="password"
                    value={pagbankConfig.api_key}
                    onChange={(e) => setPagbankConfig({ ...pagbankConfig, api_key: e.target.value })}
                    placeholder="Cole aqui seu token de acesso"
                    className="font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="environment" className="text-base font-semibold">
                    Ambiente *
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Use SANDBOX para testes e PRODUCTION para vendas reais
                  </p>
                  <Select
                    value={pagbankConfig.environment}
                    onValueChange={(value: "SANDBOX" | "PRODUCTION") => 
                      setPagbankConfig({ ...pagbankConfig, environment: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SANDBOX">Sandbox (Testes)</SelectItem>
                      <SelectItem value="PRODUCTION">Production (Produção)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="webhook_url" className="text-base font-semibold">
                    URL do Webhook (Opcional)
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    URL para receber notificações de pagamento. Exemplo: https://seusite.com/api/pagbank/webhook
                  </p>
                  <Input
                    id="webhook_url"
                    value={pagbankConfig.webhook_url}
                    onChange={(e) => setPagbankConfig({ ...pagbankConfig, webhook_url: e.target.value })}
                    placeholder="https://seusite.com/api/pagbank/webhook"
                  />
                </div>

                <div>
                  <Label htmlFor="soft_descriptor" className="text-base font-semibold">
                    Nome na Fatura do Cartão
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Nome que aparecerá na fatura do cliente (máx. 13 caracteres)
                  </p>
                  <Input
                    id="soft_descriptor"
                    value={pagbankConfig.soft_descriptor}
                    onChange={(e) => setPagbankConfig({ ...pagbankConfig, soft_descriptor: e.target.value.slice(0, 13) })}
                    placeholder="AGRESTE"
                    maxLength={13}
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-semibold">Modo Facilitador de Pagamento</Label>
                      <p className="text-sm text-gray-600">
                        Ative se você é um marketplace que processa pagamentos para terceiros
                      </p>
                    </div>
                    <Switch
                      checked={pagbankConfig.is_facilitador}
                      onCheckedChange={(checked) => 
                        setPagbankConfig({ ...pagbankConfig, is_facilitador: checked })
                      }
                    />
                  </div>

                  {pagbankConfig.is_facilitador && (
                    <div className="space-y-4 pl-4 border-l-2 border-[#D4704A]">
                      <div>
                        <Label htmlFor="sub_merchant_tax_id">CPF/CNPJ do Sub-Merchant</Label>
                        <Input
                          id="sub_merchant_tax_id"
                          value={pagbankConfig.sub_merchant_tax_id}
                          onChange={(e) => setPagbankConfig({ ...pagbankConfig, sub_merchant_tax_id: e.target.value })}
                          placeholder="00000000000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sub_merchant_name">Nome do Sub-Merchant</Label>
                        <Input
                          id="sub_merchant_name"
                          value={pagbankConfig.sub_merchant_name}
                          onChange={(e) => setPagbankConfig({ ...pagbankConfig, sub_merchant_name: e.target.value })}
                          placeholder="Nome da Loja"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sub_merchant_reference_id">ID de Referência</Label>
                        <Input
                          id="sub_merchant_reference_id"
                          value={pagbankConfig.sub_merchant_reference_id}
                          onChange={(e) => setPagbankConfig({ ...pagbankConfig, sub_merchant_reference_id: e.target.value })}
                          placeholder="LOJA001"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sub_merchant_mcc">MCC (Código de Categoria)</Label>
                        <Input
                          id="sub_merchant_mcc"
                          value={pagbankConfig.sub_merchant_mcc}
                          onChange={(e) => setPagbankConfig({ ...pagbankConfig, sub_merchant_mcc: e.target.value })}
                          placeholder="5691"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSavePagBankConfig}
                    className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                    disabled={!pagbankConfig.api_key || !pagbankConfig.environment}
                  >
                    <Settings size={18} className="mr-2" />
                    Salvar Configuração
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://developer.pagbank.com.br/docs/primeiros-passos-pagbank', '_blank')}
                  >
                    Ver Documentação
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Métodos de Pagamento Disponíveis:</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>✓ <strong>PIX</strong> - Pagamento instantâneo via QR Code</li>
                    <li>✓ <strong>Boleto</strong> - Boleto bancário com vencimento configurável</li>
                    <li>✓ <strong>Cartão de Crédito</strong> - Parcelamento em até 12x</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}