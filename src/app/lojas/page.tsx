"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Store, ArrowLeft, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const stores = [
  {
    slug: "davi",
    name: "Loja do Davi",
    owner: "Davi Silva",
    description: "Moda masculina e feminina direto do Parque das Feiras",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    products: 6,
    rating: 4.8
  }
];

export default function StoresPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteStores, setFavoriteStores] = useState<string[]>([]);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se o cliente está logado
    const isLoggedIn = localStorage.getItem("clientLoggedIn");
    setIsClientLoggedIn(isLoggedIn === "true");
    
    // Carregar lojas favoritas
    if (isLoggedIn === "true") {
      const saved = localStorage.getItem("client_favorite_stores");
      if (saved) {
        try {
          const favorites = JSON.parse(saved);
          setFavoriteStores(favorites.map((f: any) => f.slug));
        } catch (error) {
          console.error("Erro ao carregar favoritos:", error);
        }
      }
    }
  }, []);

  const toggleFavorite = (storeSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isClientLoggedIn) {
      router.push("/login");
      return;
    }

    setFavoriteStores((prev) => {
      const isFavorite = prev.includes(storeSlug);
      let updated;
      
      if (isFavorite) {
        updated = prev.filter((slug) => slug !== storeSlug);
      } else {
        updated = [...prev, storeSlug];
      }
      
      // Atualizar localStorage
      const saved = localStorage.getItem("client_favorite_stores");
      if (saved) {
        try {
          const favorites = JSON.parse(saved);
          const store = stores.find((s) => s.slug === storeSlug);
          if (store) {
            if (isFavorite) {
              const filtered = favorites.filter((f: any) => f.slug !== storeSlug);
              localStorage.setItem("client_favorite_stores", JSON.stringify(filtered));
            } else {
              const newFavorite = {
                slug: store.slug,
                name: store.name,
                owner: store.owner,
                image: store.image,
              };
              localStorage.setItem("client_favorite_stores", JSON.stringify([...favorites, newFavorite]));
            }
          }
        } catch (error) {
          console.error("Erro ao salvar favoritos:", error);
        }
      } else if (!isFavorite) {
        const store = stores.find((s) => s.slug === storeSlug);
        if (store) {
          const newFavorite = {
            slug: store.slug,
            name: store.name,
            owner: store.owner,
            image: store.image,
          };
          localStorage.setItem("client_favorite_stores", JSON.stringify([newFavorite]));
        }
      }
      
      return updated;
    });
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#D4704A]">Agreste Conectado</h1>
              <p className="text-sm text-gray-600">Marketplace</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-[#D4704A] text-[#D4704A] hover:bg-[#D4704A] hover:text-white"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voltar ao Site
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#D4704A] to-[#c05f3d] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Explore Nossas Lojas</h2>
          <p className="text-xl text-white/90 mb-8">
            Descubra produtos únicos de comerciantes locais
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar lojas ou produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Lojas Disponíveis ({filteredStores.length})
          </h3>
          <p className="text-gray-600">
            Navegue pelas lojas e encontre o que procura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card
              key={store.slug}
              className="overflow-hidden hover:shadow-xl transition-all cursor-pointer bg-white group relative"
              onClick={() => router.push(`/loja/${store.slug}`)}
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isClientLoggedIn && (
                  <button
                    onClick={(e) => toggleFavorite(store.slug, e)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
                  >
                    <Heart
                      size={20}
                      className={favoriteStores.includes(store.slug) ? "text-red-500 fill-red-500" : "text-gray-400"}
                    />
                  </button>
                )}
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
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {store.products} produtos
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-semibold">{store.rating}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-[#D4704A] hover:bg-[#c05f3d] text-white">
                  Visitar Loja
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhuma loja encontrada</p>
          </div>
        )}
      </main>
    </div>
  );
}
