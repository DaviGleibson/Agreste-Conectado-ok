"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, ArrowLeft, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { ProductStorage, Product } from "@/lib/products-storage";

interface StoreAppearance {
  banner: string;
  logo: string;
  primaryButtonColor: string;
  secondaryButtonColor: string;
  buttonTextColor: string;
}

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<{[key: number]: number}>({});
  const [storeAppearance, setStoreAppearance] = useState<StoreAppearance>({
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    logo: "",
    primaryButtonColor: "#D4704A",
    secondaryButtonColor: "#8B9D83",
    buttonTextColor: "#FFFFFF",
  });

  const [isStorePaused, setIsStorePaused] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se o cliente está logado
    const isLoggedIn = localStorage.getItem("clientLoggedIn");
    setIsClientLoggedIn(isLoggedIn === "true");
    
    // Verificar se a loja está favoritada
    if (isLoggedIn === "true") {
      const saved = localStorage.getItem("client_favorite_stores");
      if (saved) {
        try {
          const favorites = JSON.parse(saved);
          const isFav = favorites.some((f: any) => f.slug === slug);
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Erro ao verificar favoritos:", error);
        }
      }
    }
    
    // Verificar se a loja está pausada
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_merchants");
      if (saved) {
        try {
          const merchants = JSON.parse(saved);
          const merchant = merchants.find((m: any) => m.id === slug);
          if (merchant && merchant.isPaused) {
            setIsStorePaused(true);
          }
        } catch (error) {
          console.error("Erro ao verificar status da loja:", error);
        }
      }
    }

    // Carregar produtos do lojista
    const merchantProducts = ProductStorage.getByMerchant(slug);
    setProducts(merchantProducts);
    
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem(`cart_${slug}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      }
    }
    
    // Carregar aparência personalizada da loja
    const saved = localStorage.getItem(`storeAppearance_${slug}`);
    if (saved) {
      try {
        const appearance = JSON.parse(saved);
        setStoreAppearance({
          banner: appearance.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
          logo: appearance.logo || "",
          primaryButtonColor: appearance.primaryButtonColor || "#D4704A",
          secondaryButtonColor: appearance.secondaryButtonColor || "#8B9D83",
          buttonTextColor: appearance.buttonTextColor || "#FFFFFF",
        });
      } catch (error) {
        console.error("Erro ao carregar aparência da loja:", error);
      }
    }
  }, [slug]);

  const store = {
    name: "Loja do Davi",
    owner: "Davi Silva",
    description: "Moda masculina e feminina direto do Parque das Feiras",
    banner: storeAppearance.banner,
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = () => {
    if (!isClientLoggedIn) {
      router.push("/login");
      return;
    }

    const storeData = {
      slug: slug,
      name: "Loja do Davi", // TODO: pegar dinamicamente
      owner: "Davi Silva", // TODO: pegar dinamicamente
      image: storeAppearance.banner,
    };

    const saved = localStorage.getItem("client_favorite_stores");
    let favorites = saved ? JSON.parse(saved) : [];
    
    if (isFavorite) {
      favorites = favorites.filter((f: any) => f.slug !== slug);
    } else {
      favorites.push(storeData);
    }
    
    localStorage.setItem("client_favorite_stores", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const addToCart = (product: Product) => {
    const cartItem = {
      ...product,
      quantity: 1,
      storeSlug: slug,
      storeName: store.name,
    };
    
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem(`cart_${slug}`);
    let currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = currentCart.find((item: any) => item.id === product.id);
    if (existingItem) {
      currentCart = currentCart.map((item: any) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      currentCart.push(cartItem);
    }
    
    // Salvar no localStorage
    localStorage.setItem(`cart_${slug}`, JSON.stringify(currentCart));
    setCart(currentCart);
  };

  const nextImage = (productId: number, totalImages: number) => {
    setSelectedImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (productId: number, totalImages: number) => {
    setSelectedImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
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
              className="text-white relative"
              style={{
                backgroundColor: storeAppearance.primaryButtonColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
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
        {isClientLoggedIn && (
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
          >
            <Heart
              size={24}
              className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}
            />
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{store.name}</h1>
            <p className="text-white/90 text-lg">{store.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loja Pausada Message */}
        {isStorePaused && (
          <Card className="mb-6 border-2 border-gray-300 bg-gray-50">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-3xl">⏸️</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loja Pausada</h2>
              <p className="text-gray-600 mb-4">
                Esta loja está temporariamente pausada. Entre em contato com o administrador para mais informações.
              </p>
            </div>
          </Card>
        )}

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
        {!isStorePaused && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const currentImageIndex = selectedImageIndex[product.id] || 0;
                  const hasMultipleImages = product.images.length > 1;

                  return (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-xl transition-shadow bg-white"
                    >
                      <div className="aspect-square overflow-hidden relative group">
                        <img
                          src={product.images[currentImageIndex]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Image Navigation */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={() => prevImage(product.id, product.images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              onClick={() => nextImage(product.id, product.images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronRight size={20} />
                            </button>
                            
                            {/* Image Indicators */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {product.images.map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`w-2 h-2 rounded-full ${
                                    idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="p-4">
                        {product.category && (
                          <span 
                            className="text-xs font-semibold px-2 py-1 rounded"
                            style={{
                              color: storeAppearance.secondaryButtonColor,
                              backgroundColor: `${storeAppearance.secondaryButtonColor}20`,
                            }}
                          >
                            {product.category}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span 
                              className="text-2xl font-bold"
                              style={{ color: storeAppearance.primaryButtonColor }}
                            >
                              R$ {product.price.toFixed(2)}
                            </span>
                            <p className={`text-xs mt-1 ${
                              product.stock > 10 ? 'text-green-600' : 
                              product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                            </p>
                          </div>
                          <Button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="text-white disabled:opacity-50"
                            style={{
                              backgroundColor: storeAppearance.primaryButtonColor,
                              color: storeAppearance.buttonTextColor,
                            }}
                            onMouseEnter={(e) => {
                              if (product.stock !== 0) {
                                e.currentTarget.style.opacity = "0.9";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = product.stock === 0 ? "0.5" : "1";
                            }}
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Nenhum produto encontrado</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}