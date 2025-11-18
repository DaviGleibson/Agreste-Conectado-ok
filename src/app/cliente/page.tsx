"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Store,
  ShoppingCart,
  LogOut,
  Search,
  Package,
  Star,
  ArrowRight,
} from "lucide-react";
import { ProductStorage, Product } from "@/lib/products-storage";

interface FavoriteStore {
  slug: string;
  name: string;
  owner: string;
  image: string;
}

export default function ClientAreaPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientName, setClientName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);
  const [activeTab, setActiveTab] = useState<"lojas" | "favoritos" | "pedidos">("lojas");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("clientLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      const name = localStorage.getItem("clientName") || "Cliente";
      setClientName(name);
      
      // Carregar lojas favoritas
      loadFavoriteStores();
    }
  }, [router]);

  const loadFavoriteStores = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("client_favorite_stores");
      if (saved) {
        try {
          setFavoriteStores(JSON.parse(saved));
        } catch (error) {
          console.error("Erro ao carregar lojas favoritas:", error);
        }
      }
    }
  };

  const toggleFavorite = (store: FavoriteStore) => {
    setFavoriteStores((prev) => {
      const isFavorite = prev.some((s) => s.slug === store.slug);
      let updated;
      
      if (isFavorite) {
        updated = prev.filter((s) => s.slug !== store.slug);
      } else {
        updated = [...prev, store];
      }
      
      // Salvar no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("client_favorite_stores", JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("clientLoggedIn");
    localStorage.removeItem("clientEmail");
    localStorage.removeItem("clientName");
    router.push("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  // Dados de lojas disponíveis
  const availableStores = [
    {
      slug: "davi",
      name: "Loja do Davi",
      owner: "Davi Silva",
      description: "Moda masculina e feminina direto do Parque das Feiras",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
      products: 6,
      rating: 4.8,
    },
  ];

  const filteredStores = availableStores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFavorite = (slug: string) => {
    return favoriteStores.some((s) => s.slug === slug);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#D4704A]">
                Olá, {clientName}!
              </h1>
              <p className="text-sm text-gray-600">Área do Cliente</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/lojas")}
                className="text-gray-600"
              >
                <Store size={18} className="mr-2" />
                Ver Todas as Lojas
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
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
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("lojas")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "lojas"
                ? "text-[#D4704A] border-b-2 border-[#D4704A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Store size={18} className="inline mr-2" />
            Lojas
          </button>
          <button
            onClick={() => setActiveTab("favoritos")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "favoritos"
                ? "text-[#D4704A] border-b-2 border-[#D4704A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Heart size={18} className="inline mr-2" />
            Favoritos
            {favoriteStores.length > 0 && (
              <span className="ml-2 bg-[#D4704A] text-white text-xs rounded-full px-2 py-0.5">
                {favoriteStores.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("pedidos")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "pedidos"
                ? "text-[#D4704A] border-b-2 border-[#D4704A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package size={18} className="inline mr-2" />
            Meus Pedidos
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === "lojas" && (
          <div>
            {/* Busca */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar lojas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Grid de Lojas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => {
                const favorited = isFavorite(store.slug);
                return (
                  <Card
                    key={store.slug}
                    className="overflow-hidden hover:shadow-xl transition-shadow bg-white"
                  >
                    <div className="relative">
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() =>
                          toggleFavorite({
                            slug: store.slug,
                            name: store.name,
                            owner: store.owner,
                            image: store.image,
                          })
                        }
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      >
                        <Heart
                          size={20}
                          className={favorited ? "text-red-500 fill-red-500" : "text-gray-400"}
                        />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-[#D4704A]/10 rounded-full flex items-center justify-center">
                            <Store size={20} className="text-[#D4704A]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {store.name}
                            </h3>
                            <p className="text-sm text-gray-600">{store.owner}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {store.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                          {store.products} produtos
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold">{store.rating}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                        onClick={() => router.push(`/loja/${store.slug}`)}
                      >
                        Visitar Loja
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhuma loja encontrada</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "favoritos" && (
          <div>
            {favoriteStores.length === 0 ? (
              <Card className="p-12 text-center bg-white">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nenhuma loja favoritada
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece a favoritar lojas para encontrá-las facilmente depois
                </p>
                <Button
                  onClick={() => setActiveTab("lojas")}
                  className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                >
                  Explorar Lojas
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteStores.map((store) => (
                  <Card
                    key={store.slug}
                    className="overflow-hidden hover:shadow-xl transition-shadow bg-white"
                  >
                    <div className="relative">
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() =>
                          toggleFavorite({
                            slug: store.slug,
                            name: store.name,
                            owner: store.owner,
                            image: store.image,
                          })
                        }
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      >
                        <Heart size={20} className="text-red-500 fill-red-500" />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {store.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{store.owner}</p>
                      <Button
                        className="w-full bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                        onClick={() => router.push(`/loja/${store.slug}`)}
                      >
                        Visitar Loja
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "pedidos" && (
          <Card className="p-12 text-center bg-white">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum pedido ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Seus pedidos aparecerão aqui após você fazer compras nas lojas
            </p>
            <Button
              onClick={() => setActiveTab("lojas")}
              className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
            >
              Explorar Lojas
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}

