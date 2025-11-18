"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingSection() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  // Features comuns para ambos os planos
  const commonFeatures = [
    "Loja online personalizada",
    "Até 100 produtos",
    "Painel de controle completo",
    "Suporte por email",
    "Integração com redes sociais",
    "Relatórios básicos",
  ];

  const monthlyPlan = {
    name: "Plano Mensal",
    price: "R$ 40",
    period: "/mês",
    description: "Perfeito para começar",
    features: commonFeatures,
    buttonColor: "bg-[#8B9D83] hover:bg-[#7a8a74]",
    checkColor: "bg-[#8B9D83]",
    borderColor: "border-gray-200 hover:border-[#8B9D83]",
  };

  const annualPlan = {
    name: "Plano Anual",
    price: "R$ 25",
    period: "/mês",
    description: "Melhor custo-benefício",
    savings: "Economize até R$ 180/ano",
    features: commonFeatures,
    buttonColor: "bg-[#D4704A] hover:bg-[#c05f3d]",
    checkColor: "bg-[#D4704A]",
    borderColor: "border-2 border-[#D4704A]",
    highlighted: true,
  };

  const currentPlan = billingCycle === "monthly" ? monthlyPlan : annualPlan;

  return (
    <section
      id="planos"
      className="py-20 md:py-32 bg-gradient-to-br from-[#FAF7F2] to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#E8C468]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#8B9D83]/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Planos flexíveis para comerciantes de todos os tamanhos
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md border border-gray-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#D4704A] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-[#D4704A] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Anual
              <span className="ml-2 text-xs bg-[#E8C468] text-gray-900 px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center max-w-2xl mx-auto">
          <Card
            className={`relative p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full ${
              currentPlan.highlighted
                ? `${currentPlan.borderColor} shadow-xl bg-white`
                : `${currentPlan.borderColor} bg-white`
            }`}
          >
            {/* Popular badge */}
            {currentPlan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#D4704A] to-[#c05f3d] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ⭐ Mais Popular
                </span>
              </div>
            )}

            {/* Plan header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {currentPlan.name}
              </h3>
              <p className="text-gray-600 mb-4">{currentPlan.description}</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-gray-900">
                  {currentPlan.price}
                </span>
                <span className="text-gray-600">{currentPlan.period}</span>
              </div>
              {currentPlan.savings && (
                <p className="text-sm text-[#8B9D83] font-semibold mt-2">
                  {currentPlan.savings}
                </p>
              )}
            </div>

            {/* Features list */}
            <ul className="space-y-4 mb-8">
              {currentPlan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${currentPlan.checkColor}`}
                  >
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              onClick={() => {
                const planType = billingCycle === "monthly" ? "mensal" : "anual";
                const price = billingCycle === "monthly" ? 40 : 300; // 25 * 12 = 300
                router.push(`/checkout?plan=${planType}&price=${price}`);
              }}
              className={`w-full py-6 text-lg font-semibold transition-all text-white ${
                currentPlan.highlighted
                  ? `${currentPlan.buttonColor} shadow-lg hover:shadow-xl`
                  : currentPlan.buttonColor
              }`}
            >
              Contratar Plano
            </Button>
          </Card>
        </div>

      </div>
    </section>
  );
}
