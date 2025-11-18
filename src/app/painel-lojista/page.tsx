"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  LogOut,
  Upload,
  X,
  Image as ImageIcon,
  Scissors,
  CreditCard,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductStorage, Product } from "@/lib/products-storage";
import { ImageCropper } from "@/components/ImageCropper";

type AppearanceColorField = "primaryButtonColor" | "secondaryButtonColor" | "buttonTextColor";

interface StoreAppearance {
  banner: string;
  logo: string;
  primaryButtonColor: string;
  secondaryButtonColor: string;
  buttonTextColor: string;
}

const defaultStoreAppearance: StoreAppearance = {
  banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  logo: "",
  primaryButtonColor: "#D4704A",
  secondaryButtonColor: "#8B9D83",
  buttonTextColor: "#FFFFFF",
};

export default function MerchantDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [merchantId, setMerchantId] = useState("davi");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as string[],
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Estado para configuração do PagBank
  interface MerchantPagBankConfig {
    api_key: string;
    environment: "SANDBOX" | "PRODUCTION";
    webhook_url: string;
    soft_descriptor: string;
    enabled_payment_methods: {
      pix: boolean;
      boleto: boolean;
      cartao: boolean;
    };
  }

  const [pagbankConfig, setPagbankConfig] = useState<MerchantPagBankConfig>({
    api_key: "",
    environment: "SANDBOX",
    webhook_url: "",
    soft_descriptor: "",
    enabled_payment_methods: {
      pix: false,
      boleto: false,
      cartao: false,
    },
  });

  const [adminAllowedMethods, setAdminAllowedMethods] = useState<{
    pix: boolean;
    boleto: boolean;
    cartao: boolean;
  }>({
    pix: true,
    boleto: true,
    cartao: true,
  });

  // Estado para aparência da loja
  const [storeAppearance, setStoreAppearance] = useState<StoreAppearance>(defaultStoreAppearance);

  // Estados para o cropper
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropType, setCropType] = useState<"banner" | "logo" | null>(null);
  
  // Refs para os inputs de arquivo
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Verificar autenticação
    const isLoggedIn = localStorage.getItem("merchantLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
    
    // Inicializar produtos padrão se necessário
    ProductStorage.initDefaultProducts(merchantId);
    
    // Carregar produtos do lojista
    loadProducts();
    
    // Carregar aparência da loja
    loadStoreAppearance();
    
    // Carregar métodos permitidos pelo admin
    const adminConfig = localStorage.getItem("admin_pagbank_config");
    if (adminConfig) {
      try {
        const config = JSON.parse(adminConfig);
        if (config.allowed_payment_methods) {
          setAdminAllowedMethods(config.allowed_payment_methods);
        }
      } catch (error) {
        console.error("Erro ao carregar configuração do admin:", error);
      }
    }
    
    // Carregar configuração do PagBank do lojista
    const savedConfig = localStorage.getItem(`pagbank_config_${merchantId}`);
    if (savedConfig) {
      try {
        setPagbankConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Erro ao carregar configuração do PagBank:", error);
      }
    }
  }, []);
 
  const loadStoreAppearance = () => {
    const saved = localStorage.getItem(`storeAppearance_${merchantId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setStoreAppearance({ ...defaultStoreAppearance, ...parsed });
    } else {
      setStoreAppearance(defaultStoreAppearance);
    }
  };

  const saveStoreAppearance = () => {
    localStorage.setItem(`storeAppearance_${merchantId}`, JSON.stringify(storeAppearance));
    alert("Aparência da loja salva com sucesso!");
  };

  const loadProducts = () => {
    const merchantProducts = ProductStorage.getByMerchant(merchantId);
    setProducts(merchantProducts);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = editingProduct ? editingProduct.images : newProduct.images;
    
    if (currentImages.length >= 3) {
      alert('Máximo de 3 imagens por produto');
      return;
    }

    Array.from(files).slice(0, 3 - currentImages.length).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (editingProduct) {
          const newImages = [...editingProduct.images, result];
          setEditingProduct({ ...editingProduct, images: newImages });
          setImagePreviews(newImages);
        } else {
          const newImages = [...newProduct.images, result];
          setNewProduct({ ...newProduct, images: newImages });
          setImagePreviews(newImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeProductImage = (index: number) => {
    if (editingProduct) {
      const newImages = editingProduct.images.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, images: newImages });
      setImagePreviews(newImages);
    } else {
      const newImages = newProduct.images.filter((_, i) => i !== index);
      setNewProduct({ ...newProduct, images: newImages });
      setImagePreviews(newImages);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product = ProductStorage.add({
        merchantId,
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
        category: newProduct.category,
        images: newProduct.images.length > 0 ? newProduct.images : ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80"],
      });
      
      loadProducts();
      setNewProduct({ name: "", description: "", price: "", stock: "", category: "", images: [] });
      setImagePreviews([]);
      setShowAddProduct(false);
      alert('Produto adicionado com sucesso!');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImagePreviews(product.images);
    setShowAddProduct(false);
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      ProductStorage.update(editingProduct.id, editingProduct);
      loadProducts();
      setEditingProduct(null);
      setImagePreviews([]);
      alert('Produto atualizado com sucesso!');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setImagePreviews([]);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      ProductStorage.delete(id);
      loadProducts();
      alert('Produto excluído com sucesso!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("merchantLoggedIn");
    router.push("/");
  };

  // Funções para upload e corte de imagens
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se é uma imagem
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem.");
      // Resetar o input
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      // Abrir o cropper automaticamente
      setImageToCrop(imageUrl);
      setCropType(type);
    };
    reader.onerror = () => {
      alert("Erro ao carregar a imagem. Tente novamente.");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
    
    // Resetar o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = "";
  };

  const handleUploadClick = (type: "banner" | "logo") => {
    if (type === "banner" && bannerInputRef.current) {
      bannerInputRef.current.click();
    } else if (type === "logo" && logoInputRef.current) {
      logoInputRef.current.click();
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    if (cropType === "banner") {
      setStoreAppearance({ ...storeAppearance, banner: croppedImage });
    } else if (cropType === "logo") {
      setStoreAppearance({ ...storeAppearance, logo: croppedImage });
    }
    setImageToCrop(null);
    setCropType(null);
  };

  const handleCancelCrop = () => {
    setImageToCrop(null);
    setCropType(null);
  };

  const removeAppearanceImage = (type: "banner" | "logo") => {
    if (type === "banner") {
      setStoreAppearance({ ...storeAppearance, banner: "" });
    } else {
      setStoreAppearance({ ...storeAppearance, logo: "" });
    }
  };

  const handleColorChange = (field: AppearanceColorField, value: string) => {
    setStoreAppearance((prev) => ({ ...prev, [field]: value }));
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
            <TabsTrigger value="aparencia">
              <ImageIcon size={16} className="mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="pagamentos">
              <DollarSign size={16} className="mr-2" />
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
                    onClick={() => {
                      setShowAddProduct(!showAddProduct);
                      setEditingProduct(null);
                    }}
                    className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                  >
                    <Plus size={18} className="mr-2" />
                    Adicionar Produto
                  </Button>
                </div>

                {/* Add Product Form */}
                {showAddProduct && (
                  <Card className="p-6 bg-white mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Novo Produto
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome do Produto *</Label>
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
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Preço (R$) *</Label>
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
                          <Label>Estoque *</Label>
                          <Input
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, stock: e.target.value })
                            }
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Categoria</Label>
                          <Input
                            value={newProduct.category}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, category: e.target.value })
                            }
                            placeholder="Ex: Masculino"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Imagens do Produto (até 3)</Label>
                        <div className="mt-2 space-y-3">
                          {imagePreviews.length < 3 && (
                            <label className="block">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#D4704A] transition-colors">
                                <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                                <p className="text-sm text-gray-600">
                                  Clique para fazer upload ({imagePreviews.length}/3)
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  PNG, JPG até 5MB
                                </p>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          )}
                          {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                              {imagePreviews.map((img, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={img}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                  />
                                  <button
                                    onClick={() => removeProductImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={handleAddProduct}
                          className="bg-[#8B9D83] hover:bg-[#7a8a74] text-white"
                        >
                          Salvar Produto
                        </Button>
                        <Button
                          onClick={() => {
                            setShowAddProduct(false);
                            setImagePreviews([]);
                            setNewProduct({ name: "", description: "", price: "", stock: "", category: "", images: [] });
                          }}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Edit Product Form */}
                {editingProduct && (
                  <Card className="p-6 bg-white mb-6 border-2 border-[#E8C468]">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Editar Produto
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome do Produto *</Label>
                        <Input
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={editingProduct.description}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Preço (R$) *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Estoque *</Label>
                          <Input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Categoria</Label>
                          <Input
                            value={editingProduct.category || ""}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, category: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Imagens do Produto (até 3)</Label>
                        <div className="mt-2 space-y-3">
                          {imagePreviews.length < 3 && (
                            <label className="block">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#D4704A] transition-colors">
                                <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                                <p className="text-sm text-gray-600">
                                  Adicionar mais imagens ({imagePreviews.length}/3)
                                </p>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          )}
                          {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                              {imagePreviews.map((img, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={img}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                  />
                                  <button
                                    onClick={() => removeProductImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={handleUpdateProduct}
                          className="bg-[#8B9D83] hover:bg-[#7a8a74] text-white"
                        >
                          Atualizar Produto
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Products List */}
                <div className="space-y-4">
                  {products.map((product) => (
                    <Card key={product.id} className="p-4 bg-white">
                      <div className="flex gap-4">
                        <div className="flex gap-2">
                          {product.images.slice(0, 2).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                          {product.images.length > 2 && (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm font-semibold">
                              +{product.images.length - 2}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-lg font-bold text-[#D4704A]">
                              R$ {product.price.toFixed(2)}
                            </p>
                            <p className={`text-sm font-medium ${
                              product.stock > 10 ? 'text-green-600' : 
                              product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              Estoque: {product.stock}
                            </p>
                            {product.category && (
                              <span className="text-xs bg-[#8B9D83]/10 text-[#8B9D83] px-2 py-1 rounded">
                                {product.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
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

          <TabsContent value="aparencia">
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon size={24} className="text-[#D4704A]" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Aparência da Loja</h2>
                  <p className="text-sm text-gray-600">Personalize o visual da sua loja com banner e logo</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Banner */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Banner da Loja
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Imagem que aparece no topo da sua loja (recomendado: 1200x400px)
                  </p>
                  
                  {storeAppearance.banner ? (
                    <div className="relative mb-4">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={storeAppearance.banner}
                          alt="Banner da loja"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setImageToCrop(storeAppearance.banner);
                            setCropType("banner");
                          }}
                          className="border-[#D4704A] text-[#D4704A] hover:bg-[#D4704A] hover:text-white"
                        >
                          <Scissors size={16} className="mr-2" />
                          Cortar Imagem
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleUploadClick("banner")}
                          className="border-[#8B9D83] text-[#8B9D83] hover:bg-[#8B9D83] hover:text-white"
                        >
                          <Upload size={16} className="mr-2" />
                          Trocar Imagem
                        </Button>
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "banner")}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeAppearanceImage("banner")}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <X size={16} className="mr-2" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4704A] transition-colors">
                        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                        <p className="text-sm text-gray-600 font-medium">
                          Clique para fazer upload do banner
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qualquer formato de imagem
                        </p>
                      </div>
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "banner")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Logo */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Logo da Loja (Opcional)
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Logo que aparece na sua loja (recomendado: formato quadrado, mínimo 200x200px)
                  </p>
                  
                  {storeAppearance.logo ? (
                    <div className="relative mb-4">
                      <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={storeAppearance.logo}
                          alt="Logo da loja"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setImageToCrop(storeAppearance.logo);
                            setCropType("logo");
                          }}
                          className="border-[#D4704A] text-[#D4704A] hover:bg-[#D4704A] hover:text-white"
                        >
                          <Scissors size={16} className="mr-2" />
                          Cortar Imagem
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleUploadClick("logo")}
                          className="border-[#8B9D83] text-[#8B9D83] hover:bg-[#8B9D83] hover:text-white"
                        >
                          <Upload size={16} className="mr-2" />
                          Trocar Imagem
                        </Button>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "logo")}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeAppearanceImage("logo")}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <X size={16} className="mr-2" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4704A] transition-colors max-w-md">
                        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                        <p className="text-sm text-gray-600 font-medium">
                          Clique para fazer upload do logo
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qualquer formato de imagem
                        </p>
                      </div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "logo")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Cores dos Botões */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">Cores dos Botões</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Personalize as cores principais dos botões que aparecem na sua loja.
                  </p>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Botão Principal</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          aria-label="Cor do botão principal"
                          value={storeAppearance.primaryButtonColor}
                          onChange={(e) => handleColorChange("primaryButtonColor", e.target.value)}
                          className="w-12 h-12 rounded-md border border-gray-200 cursor-pointer"
                        />
                        <Input
                          value={storeAppearance.primaryButtonColor}
                          onChange={(e) => handleColorChange("primaryButtonColor", e.target.value)}
                          className="uppercase"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Botão Secundário</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          aria-label="Cor do botão secundário"
                          value={storeAppearance.secondaryButtonColor}
                          onChange={(e) => handleColorChange("secondaryButtonColor", e.target.value)}
                          className="w-12 h-12 rounded-md border border-gray-200 cursor-pointer"
                        />
                        <Input
                          value={storeAppearance.secondaryButtonColor}
                          onChange={(e) => handleColorChange("secondaryButtonColor", e.target.value)}
                          className="uppercase"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Texto dos Botões</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          aria-label="Cor do texto dos botões"
                          value={storeAppearance.buttonTextColor}
                          onChange={(e) => handleColorChange("buttonTextColor", e.target.value)}
                          className="w-12 h-12 rounded-md border border-gray-200 cursor-pointer"
                        />
                        <Input
                          value={storeAppearance.buttonTextColor}
                          onChange={(e) => handleColorChange("buttonTextColor", e.target.value)}
                          className="uppercase"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Pré-visualização</p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        style={{
                          backgroundColor: storeAppearance.primaryButtonColor,
                          color: storeAppearance.buttonTextColor,
                          borderColor: storeAppearance.primaryButtonColor,
                        }}
                        className="hover:opacity-90"
                      >
                        Botão Principal
                      </Button>
                      <Button
                        variant="outline"
                        style={{
                          backgroundColor: storeAppearance.secondaryButtonColor,
                          color: storeAppearance.buttonTextColor,
                          borderColor: storeAppearance.secondaryButtonColor,
                        }}
                        className="hover:opacity-90"
                      >
                        Botão Secundário
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={saveStoreAppearance}
                    className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                  >
                    <ImageIcon size={18} className="mr-2" />
                    Salvar Aparência
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pagamentos">
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-12 h-12 rounded-lg bg-[#D4704A]/10 flex items-center justify-center">
                  <CreditCard size={24} className="text-[#D4704A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Configuração de Pagamentos</h2>
                  <p className="text-sm text-gray-600">
                    Configure os métodos de pagamento que seus clientes poderão usar
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Configuração básica do PagBank */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Configuração do PagBank</h3>
                  
                  <div>
                    <Label htmlFor="merchant_api_key">Token de Acesso (API Key) *</Label>
                    <Input
                      id="merchant_api_key"
                      type="password"
                      value={pagbankConfig.api_key}
                      onChange={(e) => setPagbankConfig((prev) => ({ ...prev, api_key: e.target.value }))}
                      placeholder="Cole aqui seu token de acesso"
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <Label>Ambiente *</Label>
                    <Select
                      value={pagbankConfig.environment}
                      onValueChange={(value: "SANDBOX" | "PRODUCTION") =>
                        setPagbankConfig((prev) => ({ ...prev, environment: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ambiente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SANDBOX">Sandbox (Testes)</SelectItem>
                        <SelectItem value="PRODUCTION">Production (Produção)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="merchant_soft_descriptor">Nome na Fatura do Cartão</Label>
                    <Input
                      id="merchant_soft_descriptor"
                      value={pagbankConfig.soft_descriptor}
                      onChange={(e) =>
                        setPagbankConfig((prev) => ({ ...prev, soft_descriptor: e.target.value.slice(0, 13) }))
                      }
                      maxLength={13}
                      placeholder="Nome da sua loja"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máx. 13 caracteres.</p>
                  </div>
                </div>

                {/* Métodos de pagamento */}
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Métodos de Pagamento Disponíveis
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Escolha quais métodos de pagamento você quer disponibilizar para seus clientes.
                      Apenas os métodos habilitados pelo administrador aparecerão aqui.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* PIX */}
                    <div className={`flex items-center justify-between p-4 border rounded-lg ${
                      !adminAllowedMethods.pix ? "opacity-50 bg-gray-50" : ""
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">💳</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">PIX</p>
                          <p className="text-sm text-gray-600">Pagamento instantâneo via QR Code</p>
                          {!adminAllowedMethods.pix && (
                            <p className="text-xs text-red-600 mt-1">Não habilitado pelo administrador</p>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={pagbankConfig.enabled_payment_methods.pix}
                        disabled={!adminAllowedMethods.pix}
                        onCheckedChange={(checked) =>
                          setPagbankConfig((prev) => ({
                            ...prev,
                            enabled_payment_methods: { ...prev.enabled_payment_methods, pix: checked },
                          }))
                        }
                      />
                    </div>

                    {/* Boleto */}
                    <div className={`flex items-center justify-between p-4 border rounded-lg ${
                      !adminAllowedMethods.boleto ? "opacity-50 bg-gray-50" : ""
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">📄</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Boleto Bancário</p>
                          <p className="text-sm text-gray-600">Vencimento em 3 dias úteis</p>
                          {!adminAllowedMethods.boleto && (
                            <p className="text-xs text-red-600 mt-1">Não habilitado pelo administrador</p>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={pagbankConfig.enabled_payment_methods.boleto}
                        disabled={!adminAllowedMethods.boleto}
                        onCheckedChange={(checked) =>
                          setPagbankConfig((prev) => ({
                            ...prev,
                            enabled_payment_methods: { ...prev.enabled_payment_methods, boleto: checked },
                          }))
                        }
                      />
                    </div>

                    {/* Cartão */}
                    <div className={`flex items-center justify-between p-4 border rounded-lg ${
                      !adminAllowedMethods.cartao ? "opacity-50 bg-gray-50" : ""
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <CreditCard size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Cartão de Crédito</p>
                          <p className="text-sm text-gray-600">Parcelamento em até 12x</p>
                          {!adminAllowedMethods.cartao && (
                            <p className="text-xs text-red-600 mt-1">Não habilitado pelo administrador</p>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={pagbankConfig.enabled_payment_methods.cartao}
                        disabled={!adminAllowedMethods.cartao}
                        onCheckedChange={(checked) =>
                          setPagbankConfig((prev) => ({
                            ...prev,
                            enabled_payment_methods: { ...prev.enabled_payment_methods, cartao: checked },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      if (!pagbankConfig.api_key || !pagbankConfig.environment) {
                        alert("API Key e Ambiente são obrigatórios");
                        return;
                      }
                      localStorage.setItem(`pagbank_config_${merchantId}`, JSON.stringify(pagbankConfig));
                      alert("Configuração de pagamentos salva com sucesso!");
                    }}
                    className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                  >
                    <Settings size={16} className="mr-2" />
                    Salvar Configuração
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      {/* Image Cropper Modal */}
      {imageToCrop && cropType && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
          aspectRatio={cropType === "banner" ? 16 / 9 : 1}
        />
      )}
    </div>
  );
}