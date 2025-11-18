"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

interface FormData {
  name: string;
  document: string;
  documentType: "cpf" | "cnpj";
  address: string;
  number: string;
  cep: string;
  state: string;
  city: string;
  paymentMethod: "pix" | "boleto" | "cartao" | "";
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get("plan") || "mensal";
  const price = parseFloat(searchParams.get("price") || "40");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    document: "",
    documentType: "cpf",
    address: "",
    number: "",
    cep: "",
    state: "",
    city: "",
    paymentMethod: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [adminConfigExists, setAdminConfigExists] = useState(false);

  useEffect(() => {
    // Verificar se o admin configurou o PagBank
    if (typeof window !== "undefined") {
      const adminConfig = localStorage.getItem("admin_pagbank_config");
      if (adminConfig) {
        try {
          const config = JSON.parse(adminConfig);
          if (config.api_key && config.environment) {
            setAdminConfigExists(true);
          }
        } catch (error) {
          console.error("Erro ao verificar configuração do admin:", error);
        }
      }
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.document.trim()) {
      newErrors.document = `${formData.documentType === "cpf" ? "CPF" : "CNPJ"} é obrigatório`;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Endereço é obrigatório";
    }
    if (!formData.number.trim()) {
      newErrors.number = "Número é obrigatório";
    }
    if (!formData.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
    }
    if (!formData.state.trim()) {
      newErrors.state = "Estado é obrigatório";
    }
    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateForm()) {
      if (!adminConfigExists) {
        alert("O administrador ainda não configurou os métodos de pagamento. Entre em contato para mais informações.");
        return;
      }
      setShowPaymentOptions(true);
    }
  };

  const handlePayment = async () => {
    if (!formData.paymentMethod) {
      alert("Selecione um método de pagamento");
      return;
    }

    // Aqui você integraria com a API do PagBank usando a configuração do admin
    // Por enquanto, vamos simular o processo
    alert(`Pagamento de R$ ${price.toFixed(2)} processado com sucesso! Método: ${formData.paymentMethod}`);
    
    // Salvar dados do lojista
    const merchantData = {
      ...formData,
      plan: planType,
      price: price,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(`merchant_${Date.now()}`, JSON.stringify(merchantData));
    
    // Redirecionar para login ou painel
    router.push("/login");
  };

  const formatPrice = () => {
    if (planType === "anual") {
      return `R$ ${price.toFixed(2)}/ano (R$ ${(price / 12).toFixed(2)}/mês)`;
    }
    return `R$ ${price.toFixed(2)}/mês`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/#planos")}
            className="text-gray-600 hover:text-[#D4704A]"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {showPaymentOptions ? "Método de Pagamento" : "Dados do Cadastro"}
              </h2>

              {!showPaymentOptions ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Seu nome completo"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Tipo de Documento *</Label>
                      <Select
                        value={formData.documentType}
                        onValueChange={(value: "cpf" | "cnpj") =>
                          handleInputChange("documentType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="cnpj">CNPJ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="document">
                        {formData.documentType === "cpf" ? "CPF" : "CNPJ"} *
                      </Label>
                      <Input
                        id="document"
                        value={formData.document}
                        onChange={(e) => handleInputChange("document", e.target.value)}
                        placeholder={formData.documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                        className={errors.document ? "border-red-500" : ""}
                      />
                      {errors.document && (
                        <p className="text-sm text-red-500 mt-1">{errors.document}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Rua, Avenida, etc."
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="number">Número *</Label>
                      <Input
                        id="number"
                        value={formData.number}
                        onChange={(e) => handleInputChange("number", e.target.value)}
                        placeholder="123"
                        className={errors.number ? "border-red-500" : ""}
                      />
                      {errors.number && (
                        <p className="text-sm text-red-500 mt-1">{errors.number}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => handleInputChange("cep", e.target.value)}
                        placeholder="00000-000"
                        className={errors.cep ? "border-red-500" : ""}
                      />
                      {errors.cep && (
                        <p className="text-sm text-red-500 mt-1">{errors.cep}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="PE"
                        maxLength={2}
                        className={errors.state ? "border-red-500" : ""}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Santa Cruz do Capibaribe"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleContinueToPayment}
                    className="w-full bg-[#D4704A] hover:bg-[#c05f3d] text-white py-6 text-lg"
                  >
                    Continuar para Pagamento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!adminConfigExists && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-yellow-800">
                          Configuração de pagamento não encontrada
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          O administrador precisa configurar os métodos de pagamento primeiro.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => handleInputChange("paymentMethod", "pix")}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        formData.paymentMethod === "pix"
                          ? "border-[#D4704A] bg-[#D4704A]/5"
                          : "border-gray-200 hover:border-[#D4704A]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard size={24} className="text-[#D4704A]" />
                          <div>
                            <p className="font-semibold text-gray-900">PIX</p>
                            <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                          </div>
                        </div>
                        {formData.paymentMethod === "pix" && (
                          <CheckCircle2 size={20} className="text-[#D4704A]" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => handleInputChange("paymentMethod", "boleto")}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        formData.paymentMethod === "boleto"
                          ? "border-[#D4704A] bg-[#D4704A]/5"
                          : "border-gray-200 hover:border-[#D4704A]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard size={24} className="text-[#D4704A]" />
                          <div>
                            <p className="font-semibold text-gray-900">Boleto Bancário</p>
                            <p className="text-sm text-gray-600">Vencimento em 3 dias úteis</p>
                          </div>
                        </div>
                        {formData.paymentMethod === "boleto" && (
                          <CheckCircle2 size={20} className="text-[#D4704A]" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => handleInputChange("paymentMethod", "cartao")}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        formData.paymentMethod === "cartao"
                          ? "border-[#D4704A] bg-[#D4704A]/5"
                          : "border-gray-200 hover:border-[#D4704A]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard size={24} className="text-[#D4704A]" />
                          <div>
                            <p className="font-semibold text-gray-900">Cartão de Crédito</p>
                            <p className="text-sm text-gray-600">Parcelamento em até 12x</p>
                          </div>
                        </div>
                        {formData.paymentMethod === "cartao" && (
                          <CheckCircle2 size={20} className="text-[#D4704A]" />
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentOptions(false)}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={!formData.paymentMethod || !adminConfigExists}
                      className="flex-1 bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                    >
                      Finalizar Pagamento
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Plano {planType === "mensal" ? "Mensal" : "Anual"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {planType === "anual" ? "12 meses" : "1 mês"}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[#D4704A]">{formatPrice()}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">R$ {price.toFixed(2)}</span>
                  </div>
                  {planType === "anual" && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>- R$ 180,00</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#D4704A]">
                      R$ {price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

