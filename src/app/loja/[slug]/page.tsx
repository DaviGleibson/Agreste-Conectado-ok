"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductStorage, Product, AppearanceStorage, StoreAppearance } from "@/lib/products-storage";

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<{[key: number]: number}>({});
  const [appearance, setAppearance] = useState<StoreAppearance>({
    storeName: "Loja do Davi",
    storeDescription: "Moda masculina e feminina direto do Parque das Feiras",
    bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    primaryColor: "#D4704A",
    merchantId: slug
  });

  useEffect(() => {
    // Carregar produtos do lojista
    const merchantProducts = ProductStorage.getByMerchant(slug);
    setProducts(merchantProducts);

    // Carregar aparência da loja
    const storeAppearance = AppearanceStorage.get(slug);
    setAppearance(storeAppearance);
  }, [slug]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
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
              className="text-white relative hover:opacity-90"
              style={{ backgroundColor: appearance.primaryColor }}
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
          src={appearance.bannerImage}
          alt={appearance.storeName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{appearance.storeName}</h1>
            <p className="text-white/90 text-lg">{appearance.storeDescription}</p>
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
                        backgroundColor: `${appearance.primaryColor}15`,
                        color: appearance.primaryColor
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
                        style={{ color: appearance.primaryColor }}
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
                      className="text-white disabled:opacity-50 hover:opacity-90"
                      style={{ backgroundColor: appearance.primaryColor }}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
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