"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  Store,
  ShoppingCart,
  TrendingUp,
  LogOut,
  Package,
  DollarSign,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: "Comerciantes Ativos",
      value: "523",
      change: "+12%",
      icon: Users,
      color: "#D4704A",
    },
    {
      title: "Lojas Online",
      value: "487",
      change: "+8%",
      icon: Store,
      color: "#8B9D83",
    },
    {
      title: "Produtos Cadastrados",
      value: "12,458",
      change: "+23%",
      icon: Package,
      color: "#E8C468",
    },
    {
      title: "Vendas do Mês",
      value: "R$ 245.890",
      change: "+18%",
      icon: DollarSign,
      color: "#D4704A",
    },
  ];

  const recentActivities = [
    {
      merchant: "João Silva",
      action: "Cadastrou nova loja",
      time: "Há 5 minutos",
    },
    {
      merchant: "Maria Santos",
      action: "Adicionou 15 produtos",
      time: "Há 12 minutos",
    },
    {
      merchant: "Pedro Costa",
      action: "Realizou primeira venda",
      time: "Há 23 minutos",
    },
    {
      merchant: "Ana Oliveira",
      action: "Atualizou plano para anual",
      time: "Há 1 hora",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#D4704A]">
                Agreste Conectado
              </h1>
              <p className="text-sm text-gray-600">Painel Administrativo</p>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, Administrador!
          </h2>
          <p className="text-gray-600">
            Aqui está um resumo da plataforma hoje
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const isStoresCard = stat.title === "Lojas Online";
            return (
              <Card
                key={index}
                onClick={isStoresCard ? () => router.push("/admin/lojas") : undefined}
                className={`p-6 bg-white hover:shadow-lg transition-shadow ${
                  isStoresCard ? "cursor-pointer hover:border-[#8B9D83]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon size={24} style={{ color: stat.color }} />
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card className="p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Atividades Recentes
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-10 h-10 bg-[#D4704A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users size={18} className="text-[#D4704A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.merchant}
                    </p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-[#D4704A] hover:bg-[#c05f3d] text-white">
                <Users size={18} className="mr-2" />
                Gerenciar Comerciantes
              </Button>
              <Button
                className="w-full justify-start bg-[#8B9D83] hover:bg-[#7a8a74] text-white"
                onClick={() => router.push("/admin/lojas")}
              >
                <Store size={18} className="mr-2" />
                Ver Todas as Lojas
              </Button>
              <Button className="w-full justify-start bg-[#E8C468] hover:bg-[#d9b55f] text-white">
                <ShoppingCart size={18} className="mr-2" />
                Relatório de Vendas
              </Button>
              <Button className="w-full justify-start bg-gray-600 hover:bg-gray-700 text-white">
                <TrendingUp size={18} className="mr-2" />
                Análise de Crescimento
              </Button>
              <Button
                className="w-full justify-start bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                onClick={() => router.push("/admin/pagamentos")}
              >
                <DollarSign size={18} className="mr-2" />
                Configurar Pagamentos
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
