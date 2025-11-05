"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  LogOut,
} from "lucide-react";

export default function MerchantDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
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

  useEffect(() => {
    // Simular autenticação
    const isLoggedIn = localStorage.getItem("merchantLoggedIn");
    if (!isLoggedIn) {
      // Auto-login para demo
      localStorage.setItem("merchantLoggedIn", "true");
    }
    setIsAuthenticated(true);
  }, []);

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
      </main>
    </div>
  );
}
