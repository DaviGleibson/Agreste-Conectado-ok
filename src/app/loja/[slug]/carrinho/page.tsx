"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Plus, Minus, CreditCard } from "lucide-react";

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem(`cart_${slug}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      }
    }
  }, [slug]);

  const updateQuantity = (id: number, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updated);
    // Salvar no localStorage
    localStorage.setItem(`cart_${slug}`, JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    // Salvar no localStorage
    localStorage.setItem(`cart_${slug}`, JSON.stringify(updated));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePayment = () => {
    // Verificar se o lojista configurou o PagBank
    const merchantConfig = localStorage.getItem(`pagbank_config_${slug}`);
    if (!merchantConfig) {
      alert("Esta loja ainda não configurou os métodos de pagamento. Entre em contato com o lojista.");
      return;
    }

    try {
      const config = JSON.parse(merchantConfig);
      if (!config.api_key || !config.environment) {
        alert("Configuração de pagamento incompleta. Entre em contato com o lojista.");
        return;
      }

      // Aqui você integraria com a API do PagBank usando a configuração do lojista
      // Por enquanto, vamos simular o processo
      const orderId = Math.floor(Math.random() * 10000);
      alert(`Pagamento processado com sucesso! 🎉\n\nPedido #${orderId} confirmado.\n\nO pagamento será processado usando a configuração do lojista.`);
      
      // Limpar carrinho após pagamento
      localStorage.removeItem(`cart_${slug}`);
      setCart([]);
      
      router.push(`/loja/${slug}`);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrinho Vazio</h1>
          <p className="text-gray-600 mb-6">Adicione produtos para continuar</p>
          <Button onClick={() => router.push(`/loja/${slug}`)}>
            Voltar para a Loja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/loja/${slug}`)}
            className="text-gray-600 hover:text-[#D4704A]"
          >
            <ArrowLeft size={20} className="mr-2" />
            Continuar Comprando
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Carrinho</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4 bg-white">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-lg font-bold text-[#D4704A] mb-3">
                      R$ {item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Remover
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 bg-white sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span>R$ {shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#D4704A]">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {!showCheckout ? (
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-[#D4704A] hover:bg-[#c05f3d] text-white py-6 text-lg"
                >
                  <CreditCard size={20} className="mr-2" />
                  Finalizar Compra
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Número do Cartão
                    </label>
                    <Input placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Validade
                      </label>
                      <Input placeholder="MM/AA" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        CVV
                      </label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                  <Button
                    onClick={handlePayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                  >
                    Pagar R$ {total.toFixed(2)}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
