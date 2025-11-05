"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, ArrowLeft } from "lucide-react";

// Mock data para a loja do Davi
const mockStores = {
  davi: {
    name: "Loja do Davi",
    owner: "Davi Silva",
    description: "Moda masculina e feminina direto do Parque das Feiras",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    products: [
      {
        id: 1,
        name: "Camisa Polo Masculina",
        description: "Camisa polo de alta qualidade, 100% algodão",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80",
        category: "Masculino"
      },
      {
        id: 2,
        name: "Vestido Floral Feminino",
        description: "Vestido leve e confortável, perfeito para o verão",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
        category: "Feminino"
      },
      {
        id: 3,
        name: "Calça Jeans Masculina",
        description: "Jeans premium com corte moderno",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
        category: "Masculino"
      },
      {
        id: 4,
        name: "Blusa Feminina Estampada",
        description: "Blusa elegante com estampa exclusiva",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&q=80",
        category: "Feminino"
      },
      {
        id: 5,
        name: "Bermuda Masculina",
        description: "Bermuda casual para o dia a dia",
        price: 69.90,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80",
        category: "Masculino"
      },
      {
        id: 6,
        name: "Saia Midi Feminina",
        description: "Saia midi versátil e elegante",
        price: 99.90,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80",
        category: "Feminino"
      }
    ]
  }
};

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const store = mockStores[slug as keyof typeof mockStores];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  if (!store) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loja não encontrada</h1>
          <Button onClick={() => router.push("/lojas")}>Ver todas as lojas</Button>
        </div>
      </div>
    );
  }

  const filteredProducts = store.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/lojas")}
              className="text-gray-600 hover:text-[#D4704A]"
            >
              <ArrowLeft size={20} className="mr-2" />
              Voltar
            </Button>
            <Button
              onClick={() => router.push(`/loja/${slug}/carrinho`)}
              className="bg-[#D4704A] hover:bg-[#c05f3d] text-white relative"
            >
              <ShoppingCart size={20} className="mr-2" />
              Carrinho
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E8C468] text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={store.banner}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{store.name}</h1>
            <p className="text-white/90 text-lg">{store.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-xl transition-shadow bg-white"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-[#8B9D83] bg-[#8B9D83]/10 px-2 py-1 rounded">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#D4704A]">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => addToCart(product)}
                    className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum produto encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
}
