"use client";

import { UserPlus, Store, ShoppingCart } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Cadastro do Comerciante",
      description:
        "Registre-se gratuitamente na plataforma e crie seu perfil de vendedor em poucos minutos.",
      color: "#D4704A",
    },
    {
      icon: Store,
      title: "Criação da Loja Online",
      description:
        "Configure sua loja virtual, adicione produtos, fotos e descrições de forma simples e intuitiva.",
      color: "#8B9D83",
    },
    {
      icon: ShoppingCart,
      title: "Vendas para Clientes",
      description:
        "Receba pedidos de clientes de todo o Brasil e gerencie suas vendas em um só lugar.",
      color: "#E8C468",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="py-20 md:py-32 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4704A] via-[#8B9D83] to-[#E8C468]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Três passos simples para começar a vender online e expandir seu
            negócio
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0"></div>
              )}

              {/* Card */}
              <div className="relative bg-[#FAF7F2] rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gray-200 h-full">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-lg shadow-md border-2 border-gray-200">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <step.icon size={32} style={{ color: step.color }} />
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Pronto para começar sua jornada digital?
          </p>
          <button className="text-[#D4704A] font-semibold hover:underline text-lg">
            Criar minha conta agora →
          </button>
        </div>
      </div>
    </section>
  );
}