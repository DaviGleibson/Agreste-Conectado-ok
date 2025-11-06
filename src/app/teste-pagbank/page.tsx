"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, FileText, CreditCard, Loader2 } from "lucide-react";

export default function PagBankTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Dados do cliente
  const [customer, setCustomer] = useState({
    name: "João Silva",
    email: "joao@example.com",
    tax_id: "12345678909",
  });

  // Dados do pagamento
  const [paymentData, setPaymentData] = useState({
    valor: "100.00",
    descricao: "Teste de pagamento",
  });

  // Dados do cartão
  const [cardData, setCardData] = useState({
    encrypted_card: "",
    security_code: "",
    holder_name: "JOAO SILVA",
    installments: 1,
  });

  const handlePixPayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/pagbank/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor: paymentData.valor,
          descricao: paymentData.descricao,
          customer,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBoletoPayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/pagbank/boleto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor: paymentData.valor,
          descricao: paymentData.descricao,
          customer: {
            ...customer,
            address: {
              street: "Rua Exemplo",
              number: "123",
              postal_code: "55000000",
              locality: "Centro",
              city: "Santa Cruz do Capibaribe",
              region_code: "PE",
            },
          },
          vencimento_dias: 3,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/pagbank/cartao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor: paymentData.valor,
          descricao: paymentData.descricao,
          customer,
          card_data: cardData,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#D4704A] mb-2">
            Teste de Integração PagBank
          </h1>
          <p className="text-gray-600">
            Teste os métodos de pagamento PIX, Boleto e Cartão
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Dados do Cliente */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Dados do Cliente
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>CPF</Label>
                <Input
                  value={customer.tax_id}
                  onChange={(e) =>
                    setCustomer({ ...customer, tax_id: e.target.value })
                  }
                  placeholder="00000000000"
                />
              </div>
            </div>
          </Card>

          {/* Dados do Pagamento */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Dados do Pagamento
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentData.valor}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, valor: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={paymentData.descricao}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      descricao: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white">
          <Tabs defaultValue="pix" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pix">
                <QrCode size={16} className="mr-2" />
                PIX
              </TabsTrigger>
              <TabsTrigger value="boleto">
                <FileText size={16} className="mr-2" />
                Boleto
              </TabsTrigger>
              <TabsTrigger value="cartao">
                <CreditCard size={16} className="mr-2" />
                Cartão
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pix" className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  O PIX gera um QR Code que expira em 24 horas. O cliente pode
                  pagar escaneando o código ou copiando o código PIX.
                </p>
              </div>
              <Button
                onClick={handlePixPayment}
                disabled={loading}
                className="w-full bg-[#D4704A] hover:bg-[#c05f3d] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando PIX...
                  </>
                ) : (
                  <>
                    <QrCode size={18} className="mr-2" />
                    Gerar PIX
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="boleto" className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  O Boleto é gerado com vencimento em 3 dias. O cliente pode
                  baixar o PDF ou copiar o código de barras.
                </p>
              </div>
              <Button
                onClick={handleBoletoPayment}
                disabled={loading}
                className="w-full bg-[#8B9D83] hover:bg-[#7a8a74] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Boleto...
                  </>
                ) : (
                  <>
                    <FileText size={18} className="mr-2" />
                    Gerar Boleto
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="cartao" className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> Para processar cartões, você precisa
                  usar o SDK do PagBank para criptografar os dados do cartão no
                  frontend. Este é apenas um exemplo de estrutura.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Cartão Criptografado</Label>
                  <Input
                    value={cardData.encrypted_card}
                    onChange={(e) =>
                      setCardData({ ...cardData, encrypted_card: e.target.value })
                    }
                    placeholder="Use o SDK do PagBank para criptografar"
                  />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input
                    value={cardData.security_code}
                    onChange={(e) =>
                      setCardData({ ...cardData, security_code: e.target.value })
                    }
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label>Nome no Cartão</Label>
                  <Input
                    value={cardData.holder_name}
                    onChange={(e) =>
                      setCardData({ ...cardData, holder_name: e.target.value })
                    }
                    placeholder="NOME IMPRESSO NO CARTÃO"
                  />
                </div>
                <div>
                  <Label>Parcelas</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={cardData.installments}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        installments: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleCardPayment}
                disabled={loading}
                className="w-full bg-[#E8C468] hover:bg-[#d9b559] text-gray-900"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} className="mr-2" />
                    Processar Cartão
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Resultado */}
        {result && (
          <Card className="p-6 bg-white mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resultado</h3>
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            {result.success && result.qr_code_image && (
              <div className="mt-4 text-center">
                <p className="font-semibold mb-2">QR Code PIX:</p>
                <img
                  src={result.qr_code_image}
                  alt="QR Code PIX"
                  className="mx-auto border-2 border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Código PIX: {result.qr_code_text}
                </p>
              </div>
            )}

            {result.success && result.boleto_url && (
              <div className="mt-4">
                <Button
                  onClick={() => window.open(result.boleto_url, "_blank")}
                  className="w-full bg-[#8B9D83] hover:bg-[#7a8a74] text-white"
                >
                  <FileText size={18} className="mr-2" />
                  Baixar Boleto PDF
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Código de Barras: {result.formatted_barcode}
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
