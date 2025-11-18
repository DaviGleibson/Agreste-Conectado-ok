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
  Pause,
  Play,
} from "lucide-react";

type MerchantStatus = "ativo" | "pendente" | "inadimplente" | "pausada";

interface Merchant {
  id: string;
  name: string;
  owner: string;
  email: string;
  plan: string;
  planStatus: "em dia" | "pendente" | "atrasado";
  lastPayment: string;
  status: MerchantStatus;
  storeUrl: string;
  balance: string;
  isPaused: boolean;
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
  enabled_payment_methods: {
    pix: boolean;
    boleto: boolean;
    cartao: boolean;
  };
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
  enabled_payment_methods: {
    pix: false,
    boleto: false,
    cartao: false,
  },
};

const initialMerchantsData: Merchant[] = [
  {
    id: "davi",
    name: "Loja do Davi",
    owner: "Davi Silva",
    email: "davi@example.com",
    plan: "Plano Premium",
    planStatus: "em dia",
    lastPayment: "10/11/2025",
    status: "ativo",
    storeUrl: "/loja/davi",
    balance: "R$ 12.340,00",
    isPaused: false,
  },
  {
    id: "maria",
    name: "Boutique da Maria",
    owner: "Maria Santos",
    email: "maria@example.com",
    plan: "Plano Essencial",
    planStatus: "pendente",
    lastPayment: "02/10/2025",
    status: "pendente",
    storeUrl: "/loja/maria",
    balance: "R$ 4.890,00",
    isPaused: false,
  },
  {
    id: "joao",
    name: "Tech do João",
    owner: "João Souza",
    email: "joao@example.com",
    plan: "Plano Starter",
    planStatus: "atrasado",
    lastPayment: "15/08/2025",
    status: "inadimplente",
    storeUrl: "/loja/joao",
    balance: "R$ 1.290,00",
    isPaused: true,
  },
  {
    id: "ana",
    name: "Studio da Ana",
    owner: "Ana Oliveira",
    email: "ana@example.com",
    plan: "Plano Premium",
    planStatus: "em dia",
    lastPayment: "05/11/2025",
    status: "ativo",
    storeUrl: "/loja/ana",
    balance: "R$ 8.120,00",
    isPaused: false,
  },
];

export default function AdminStoresPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    // Sempre inicia vazio, não carrega do localStorage
    return "";
  });
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | "todos">("todos");
  const [merchantsData, setMerchantsData] = useState<Merchant[]>(() => {
    // Carrega dados do localStorage ou usa os iniciais
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_merchants");
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return initialMerchantsData;
  });
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(merchantsData[0]?.id ?? "");
  const [pagbankConfig, setPagbankConfig] = useState<PagBankConfig>(defaultPagBankConfig);
  const [configSaved, setConfigSaved] = useState(false);
  const [adminAllowedMethods, setAdminAllowedMethods] = useState<{
    pix: boolean;
    boleto: boolean;
    cartao: boolean;
  }>({
    pix: true,
    boleto: true,
    cartao: true,
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      
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
    }
  }, [router]);

  // Garantir que o campo de busca está sempre vazio ao montar o componente
  useEffect(() => {
    setSearchTerm("");
    // Limpar qualquer valor que o navegador possa ter preenchido
    // Usar timeout para garantir que limpa após o navegador tentar preencher
    const timer = setTimeout(() => {
      const input = document.getElementById("store-search-input") as HTMLInputElement;
      if (input) {
        input.value = "";
        input.setAttribute("autocomplete", "new-password"); // Truque para desabilitar autocomplete
        setSearchTerm("");
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredMerchants = useMemo(() => {
    return merchantsData.filter((merchant) => {
      // Se não há termo de busca, não filtra por busca
      const matchesSearch = searchTerm.trim() === "" || 
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "todos" || merchant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, merchantsData]);

  const selectedMerchant = useMemo(
    () => merchantsData.find((merchant) => merchant.id === selectedMerchantId) ?? merchantsData[0],
    [selectedMerchantId],
  );

  useEffect(() => {
    if (!selectedMerchant) return;
    // Tentar carregar do formato do admin primeiro, depois do formato do lojista
    let saved = localStorage.getItem(`pagbankConfig_${selectedMerchant.id}`);
    if (!saved) {
      saved = localStorage.getItem(`pagbank_config_${selectedMerchant.id}`);
    }
    if (saved) {
      try {
        const config = JSON.parse(saved);
        // Garantir que os métodos de pagamento existam
        if (!config.enabled_payment_methods) {
          config.enabled_payment_methods = {
            pix: false,
            boleto: false,
            cartao: false,
          };
        }
        setPagbankConfig(config);
        setConfigSaved(true);
      } catch (error) {
        console.error("Erro ao carregar configuração:", error);
        setPagbankConfig(defaultPagBankConfig);
        setConfigSaved(false);
      }
    } else {
      setPagbankConfig(defaultPagBankConfig);
      setConfigSaved(false);
    }
  }, [selectedMerchant]);

  const togglePauseStore = (merchantId: string) => {
    setMerchantsData((prev) => {
      const updated = prev.map((merchant) => {
        if (merchant.id === merchantId) {
          const newIsPaused = !merchant.isPaused;
          return {
            ...merchant,
            isPaused: newIsPaused,
            status: newIsPaused ? "pausada" : merchant.planStatus === "atrasado" ? "inadimplente" : merchant.planStatus === "pendente" ? "pendente" : "ativo",
          };
        }
        return merchant;
      });
      // Salva no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_merchants", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const statusBadgeClass = (status: MerchantStatus) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-700";
      case "pendente":
        return "bg-yellow-100 text-yellow-700";
      case "pausada":
        return "bg-gray-100 text-gray-700";
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
    // Salvar no formato que o admin usa
    localStorage.setItem(`pagbankConfig_${selectedMerchant.id}`, JSON.stringify(pagbankConfig));
    // Também salvar no formato que o lojista espera
    localStorage.setItem(`pagbank_config_${selectedMerchant.id}`, JSON.stringify(pagbankConfig));
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Prevenir que o navegador preencha automaticamente
                if (e.target.value === "admin@agresteconectado.com") {
                  setSearchTerm("");
                  e.target.value = "";
                }
              }}
              className="bg-white pl-10"
              autoComplete="new-password"
              autoFocus={false}
              type="text"
              name={`store-search-${Date.now()}`}
              id="store-search-input"
              data-lpignore="true"
              data-form-type="other"
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
              <SelectItem value="pausada">Pausadas</SelectItem>
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
                          : merchant.status === "pausada"
                          ? "Pausada"
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
                      className={merchant.isPaused ? "text-green-600 border-green-600" : "text-orange-600 border-orange-600"}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePauseStore(merchant.id);
                      }}
                    >
                      {merchant.isPaused ? (
                        <>
                          <Play size={14} className="mr-2" />
                          Despausar Loja
                        </>
                      ) : (
                        <>
                          <Pause size={14} className="mr-2" />
                          Pausar Loja
                        </>
                      )}
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

            {/* Métodos de Pagamento Permitidos */}
            <div className="border-t pt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Métodos de Pagamento para Esta Loja
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Escolha quais métodos de pagamento esta loja poderá disponibilizar para seus clientes.
                  Apenas os métodos habilitados na configuração geral aparecerão aqui.
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
                        <p className="text-xs text-red-600 mt-1">Não habilitado na configuração geral</p>
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
                        <p className="text-xs text-red-600 mt-1">Não habilitado na configuração geral</p>
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
                        <p className="text-xs text-red-600 mt-1">Não habilitado na configuração geral</p>
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
          </Card>
        </div>
      </main>
    </div>
  );
}

