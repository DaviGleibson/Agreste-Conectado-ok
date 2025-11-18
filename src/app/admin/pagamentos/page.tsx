"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Settings,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

interface AdminPagBankConfig {
  api_key: string;
  environment: "SANDBOX" | "PRODUCTION";
  webhook_url: string;
  soft_descriptor: string;
  is_facilitador: boolean;
  sub_merchant_tax_id: string;
  sub_merchant_name: string;
  sub_merchant_reference_id: string;
  sub_merchant_mcc: string;
}

const defaultAdminPagBankConfig: AdminPagBankConfig = {
  api_key: "",
  environment: "SANDBOX",
  webhook_url: "",
  soft_descriptor: "AGRESTE",
  is_facilitador: false,
  sub_merchant_tax_id: "",
  sub_merchant_name: "",
  sub_merchant_reference_id: "",
  sub_merchant_mcc: "5691",
};

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pagbankConfig, setPagbankConfig] = useState<AdminPagBankConfig>(defaultAdminPagBankConfig);
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      // Carregar configuração salva
      const saved = localStorage.getItem("admin_pagbank_config");
      if (saved) {
        try {
          setPagbankConfig(JSON.parse(saved));
          setConfigSaved(true);
        } catch (error) {
          console.error("Erro ao carregar configuração:", error);
        }
      }
    }
  }, [router]);

  const handleSaveConfig = () => {
    if (!pagbankConfig.api_key || !pagbankConfig.environment) {
      alert("API Key e Ambiente são obrigatórios");
      return;
    }
    localStorage.setItem("admin_pagbank_config", JSON.stringify(pagbankConfig));
    setConfigSaved(true);
    alert("Configuração do PagBank salva com sucesso!");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Painel Administrativo</p>
            <h1 className="text-2xl font-bold text-[#D4704A] flex items-center gap-2">
              <DollarSign size={22} />
              Configuração de Pagamentos
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Configure os métodos de pagamento para receber mensalidades das lojas
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 bg-white space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="w-12 h-12 rounded-lg bg-[#D4704A]/10 flex items-center justify-center">
              <CreditCard size={24} className="text-[#D4704A]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">PagBank - Recebimento de Mensalidades</h2>
              <p className="text-sm text-gray-600">
                Configure sua conta PagBank para receber pagamentos das lojas
              </p>
            </div>
          </div>

          {configSaved && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-green-800 text-sm">
              <CheckCircle2 size={18} />
              <span>Configuração do PagBank salva com sucesso.</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <Label htmlFor="admin_api_key">Token de Acesso (API Key) *</Label>
              <p className="text-xs text-gray-500 mb-2">
                Obtenha em{" "}
                <a
                  href="https://minhaconta.pagseguro.uol.com.br/preferencias/integracoes.jhtml"
                  target="_blank"
                  className="text-[#D4704A] underline"
                >
                  PagBank → Integrações
                </a>
              </p>
              <Input
                id="admin_api_key"
                type="password"
                value={pagbankConfig.api_key}
                onChange={(e) => setPagbankConfig((prev) => ({ ...prev, api_key: e.target.value }))}
                placeholder="Cole aqui o token de acesso"
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
              <Label htmlFor="admin_webhook_url">URL do Webhook (opcional)</Label>
              <p className="text-xs text-gray-500 mb-2">
                URL para receber notificações de pagamento das mensalidades
              </p>
              <Input
                id="admin_webhook_url"
                value={pagbankConfig.webhook_url}
                onChange={(e) => setPagbankConfig((prev) => ({ ...prev, webhook_url: e.target.value }))}
                placeholder="https://agresteconectado.com/api/pagbank/admin/webhook"
              />
            </div>

            <div>
              <Label htmlFor="admin_soft_descriptor">Nome na Fatura do Cartão</Label>
              <Input
                id="admin_soft_descriptor"
                value={pagbankConfig.soft_descriptor}
                onChange={(e) =>
                  setPagbankConfig((prev) => ({ ...prev, soft_descriptor: e.target.value.slice(0, 13) }))
                }
                maxLength={13}
                placeholder="AGRESTE"
              />
              <p className="text-xs text-gray-500 mt-1">Máx. 13 caracteres.</p>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo Facilitador</Label>
                  <p className="text-xs text-gray-500">
                    Ative se você recebe pagamentos e repassa aos lojistas.
                  </p>
                </div>
                <Switch
                  checked={pagbankConfig.is_facilitador}
                  onCheckedChange={(checked) => setPagbankConfig((prev) => ({ ...prev, is_facilitador: checked }))}
                />
              </div>

              {pagbankConfig.is_facilitador && (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="admin_sub_tax_id">CPF/CNPJ do Sub-Merchant</Label>
                    <Input
                      id="admin_sub_tax_id"
                      value={pagbankConfig.sub_merchant_tax_id}
                      onChange={(e) => setPagbankConfig((prev) => ({ ...prev, sub_merchant_tax_id: e.target.value }))}
                      placeholder="00000000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_sub_name">Nome do Sub-Merchant</Label>
                    <Input
                      id="admin_sub_name"
                      value={pagbankConfig.sub_merchant_name}
                      onChange={(e) => setPagbankConfig((prev) => ({ ...prev, sub_merchant_name: e.target.value }))}
                      placeholder="Nome da Loja"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_sub_ref">ID de Referência</Label>
                    <Input
                      id="admin_sub_ref"
                      value={pagbankConfig.sub_merchant_reference_id}
                      onChange={(e) =>
                        setPagbankConfig((prev) => ({ ...prev, sub_merchant_reference_id: e.target.value }))
                      }
                      placeholder="LOJA001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_sub_mcc">MCC (Código de Categoria)</Label>
                    <Input
                      id="admin_sub_mcc"
                      value={pagbankConfig.sub_merchant_mcc}
                      onChange={(e) => setPagbankConfig((prev) => ({ ...prev, sub_merchant_mcc: e.target.value }))}
                      placeholder="5691"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t">
            <Button
              className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
              disabled={!pagbankConfig.api_key || !pagbankConfig.environment}
              onClick={handleSaveConfig}
            >
              <Settings size={16} className="mr-2" />
              Salvar Configuração
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open("https://developer.pagbank.com.br/docs/primeiros-passos-pagbank", "_blank")
              }
            >
              Ver Documentação
            </Button>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 space-y-1">
            <p className="font-semibold">Métodos de pagamento habilitados</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>PIX com QR Code dinâmico</li>
              <li>Boleto bancário com vencimento configurável</li>
              <li>Cartão de crédito com parcelamento em até 12x</li>
            </ul>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Validação de Pagamentos</p>
                <p className="text-xs">
                  O sistema pode validar automaticamente os pagamentos em atraso através da API do PagBank.
                  Quando uma mensalidade estiver em atraso, a loja será automaticamente pausada.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

