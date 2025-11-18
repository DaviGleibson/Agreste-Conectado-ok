"use client";

import { useEffect, useMemo, useState } from "react";
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
  Store,
  Search,
  AlertTriangle,
} from "lucide-react";

type MerchantStatus = "ativo" | "pendente" | "inadimplente";

interface Merchant {
  id: string;
  name: string;
  owner: string;
  plan: string;
  planStatus: "em dia" | "pendente" | "atrasado";
  lastPayment: string;
  status: MerchantStatus;
  storeUrl: string;
  balance: string;
}

interface PagBankConfig {
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

const defaultPagBankConfig: PagBankConfig = {
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

const merchantsData: Merchant[] = [
  {
    id: "davi",
    name: "Loja do Davi",
    owner: "Davi Silva",
    plan: "Plano Premium",
    planStatus: "em dia",
    lastPayment: "10/11/2025",
    status: "ativo",
    storeUrl: "/loja/davi",
    balance: "R$ 12.340,00",
  },
  {
    id: "maria",
    name: "Boutique da Maria",
    owner: "Maria Santos",
    plan: "Plano Essencial",
    planStatus: "pendente",
    lastPayment: "02/10/2025",
    status: "pendente",
    storeUrl: "/loja/maria",
    balance: "R$ 4.890,00",
  },
  {
    id: "joao",
    name: "Tech do João",
    owner: "João Souza",
    plan: "Plano Starter",
    planStatus: "atrasado",
    lastPayment: "15/08/2025",
    status: "inadimplente",
    storeUrl: "/loja/joao",
    balance: "R$ 1.290,00",
  },
  {
    id: "ana",
    name: "Studio da Ana",
    owner: "Ana Oliveira",
    plan: "Plano Premium",
    planStatus: "em dia",
    lastPayment: "05/11/2025",
    status: "ativo",
    storeUrl: "/loja/ana",
    balance: "R$ 8.120,00",
  },
];

export default function AdminStoresPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | "todos">("todos");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(merchantsData[0]?.id ?? "");
  const [pagbankConfig, setPagbankConfig] = useState<PagBankConfig>(defaultPagBankConfig);
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const filteredMerchants = useMemo(() => {
    return merchantsData.filter((merchant) => {
      const matchesSearch =
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "todos" || merchant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const selectedMerchant = useMemo(
    () => merchantsData.find((merchant) => merchant.id === selectedMerchantId) ?? merchantsData[0],
    [selectedMerchantId],
  );

  useEffect(() => {
    if (!selectedMerchant) return;
    const saved = localStorage.getItem(`pagbankConfig_${selectedMerchant.id}`);
    if (saved) {
      setPagbankConfig(JSON.parse(saved));
      setConfigSaved(true);
    } else {
      setPagbankConfig(defaultPagBankConfig);
      setConfigSaved(false);
    }
  }, [selectedMerchant]);

  const statusBadgeClass = (status: MerchantStatus) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-700";
      case "pendente":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const planStatusMeta: Record<
    Merchant["planStatus"],
    { label: string; description: string; icon: typeof CheckCircle2; color: string; border: string }
  > = {
    "em dia": {
      label: "Pagamentos em dia",
      description: "Esta loja está com o plano regularizado.",
      icon: CheckCircle2,
      color: "text-green-700",
      border: "border-green-200 bg-green-50",
    },
    pendente: {
      label: "Pagamento pendente",
      description: "Há uma mensalidade aguardando compensação.",
      icon: AlertTriangle,
      color: "text-yellow-700",
      border: "border-yellow-200 bg-yellow-50",
    },
    atrasado: {
      label: "Inadimplente",
      description: "Plano bloqueado até regularização com o financeiro.",
      icon: AlertTriangle,
      color: "text-red-700",
      border: "border-red-200 bg-red-50",
    },
  };

  const handleSavePagBankConfig = () => {
    if (!selectedMerchant) return;
    if (!pagbankConfig.api_key || !pagbankConfig.environment) {
      alert("API Key e Ambiente são obrigatórios");
      return;
    }
    localStorage.setItem(`pagbankConfig_${selectedMerchant.id}`, JSON.stringify(pagbankConfig));
    setConfigSaved(true);
    alert(`Configuração do PagBank para ${selectedMerchant.name} salva com sucesso!`);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!selectedMerchant) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <Card className="p-8 bg-white text-center space-y-4">
          <Store size={32} className="mx-auto text-[#D4704A]" />
          <h2 className="text-xl font-bold text-gray-900">Nenhuma loja cadastrada</h2>
          <p className="text-gray-600 text-sm">
            Cadastre a primeira loja para começar a configurar integrações de pagamento.
          </p>
          <Button onClick={() => router.push("/admin")}>Voltar ao Dashboard</Button>
        </Card>
      </div>
    );
  }

  const planMeta = planStatusMeta[selectedMerchant.planStatus];
  const PlanIcon = planMeta.icon;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Painel Administrativo</p>
            <h1 className="text-2xl font-bold text-[#D4704A] flex items-center gap-2">
              <Store size={22} />
              Lojas Online
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar loja ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: MerchantStatus | "todos") => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-64 bg-white">
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="inadimplente">Inadimplentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Lojas Ativas</h2>
              <span className="text-sm text-gray-500">{filteredMerchants.length} resultados</span>
            </div>
            <div className="space-y-4">
              {filteredMerchants.map((merchant) => (
                <div
                  key={merchant.id}
                  className={`rounded-xl border p-4 transition-all ${
                    merchant.id === selectedMerchant.id
                      ? "border-[#D4704A] bg-[#D4704A]/5 shadow-sm"
                      : "border-gray-200 bg-white hover:border-[#D4704A]/50"
                  }`}
                  onClick={() => setSelectedMerchantId(merchant.id)}
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Responsável</p>
                      <p className="text-sm font-semibold text-gray-900">{merchant.owner}</p>
                      <h3 className="text-lg font-bold text-gray-900">{merchant.name}</h3>
                      <p className="text-sm text-gray-500">
                        Plano: <span className="font-medium">{merchant.plan}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-1">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusBadgeClass(merchant.status)}`}>
                        {merchant.status === "ativo"
                          ? "Em dia"
                          : merchant.status === "pendente"
                          ? "Pagamento pendente"
                          : "Inadimplente"}
                      </span>
                      <p className="text-xs text-gray-500">Último pagamento: {merchant.lastPayment}</p>
                      <p className="text-xs text-gray-500">Saldo disponível: {merchant.balance}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(merchant.storeUrl);
                      }}
                    >
                      Ver Loja
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#D4704A] border-[#D4704A]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMerchantId(merchant.id);
                      }}
                    >
                      <CreditCard size={14} className="mr-2" />
                      Configurar PagBank
                    </Button>
                  </div>
                </div>
              ))}
              {filteredMerchants.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">
                  Nenhuma loja encontrada combinando esses filtros.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-white space-y-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-wide text-gray-400">Configurando PagBank para</p>
              <h2 className="text-2xl font-bold text-gray-900">{selectedMerchant.name}</h2>
              <p className="text-sm text-gray-500">Responsável: {selectedMerchant.owner}</p>
              <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${planMeta.border}`}>
                <PlanIcon size={20} className={planMeta.color} />
                <div>
                  <p className={`text-sm font-semibold ${planMeta.color}`}>{planMeta.label}</p>
                  <p className="text-xs text-gray-500">{planMeta.description}</p>
                </div>
              </div>
            </div>

            {configSaved && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-green-800 text-sm">
                <CheckCircle2 size={18} />
                <span>Configuração do PagBank salva para esta loja.</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <Label htmlFor="api_key">Token de Acesso (API Key) *</Label>
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
                  id="api_key"
                  type="password"
                  value={pagbankConfig.api_key}
                  onChange={(e) => setPagbankConfig((prev) => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Cole aqui o token de acesso do lojista"
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
                <Label htmlFor="webhook_url">URL do Webhook (opcional)</Label>
                <Input
                  id="webhook_url"
                  value={pagbankConfig.webhook_url}
                  onChange={(e) => setPagbankConfig((prev) => ({ ...prev, webhook_url: e.target.value }))}
                  placeholder="https://sualoja.com/api/pagbank/webhook"
                />
              </div>

              <div>
                <Label htmlFor="soft_descriptor">Nome na Fatura do Cartão</Label>
                <Input
                  id="soft_descriptor"
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
                      Ative se o marketplace recebe pagamentos e repassa aos lojistas.
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
                      <Label htmlFor="sub_tax_id">CPF/CNPJ do Sub-Merchant</Label>
                      <Input
                        id="sub_tax_id"
                        value={pagbankConfig.sub_merchant_tax_id}
                        onChange={(e) => setPagbankConfig((prev) => ({ ...prev, sub_merchant_tax_id: e.target.value }))}
                        placeholder="00000000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sub_name">Nome do Sub-Merchant</Label>
                      <Input
                        id="sub_name"
                        value={pagbankConfig.sub_merchant_name}
                        onChange={(e) => setPagbankConfig((prev) => ({ ...prev, sub_merchant_name: e.target.value }))}
                        placeholder="Nome da Loja"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sub_ref">ID de Referência</Label>
                      <Input
                        id="sub_ref"
                        value={pagbankConfig.sub_merchant_reference_id}
                        onChange={(e) =>
                          setPagbankConfig((prev) => ({ ...prev, sub_merchant_reference_id: e.target.value }))
                        }
                        placeholder="LOJA001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sub_mcc">MCC (Código de Categoria)</Label>
                      <Input
                        id="sub_mcc"
                        value={pagbankConfig.sub_merchant_mcc}
                        onChange={(e) => setPagbankConfig((prev) => ({ ...prev, sub_merchant_mcc: e.target.value }))}
                        placeholder="5691"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                disabled={!pagbankConfig.api_key || !pagbankConfig.environment}
                onClick={handleSavePagBankConfig}
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
          </Card>
        </div>
      </main>
    </div>
  );
}

