"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      id="inicio"
      className="relative bg-gradient-to-br from-[#FAF7F2] via-[#FAF7F2] to-[#f5ede3] py-20 md:py-32 overflow-hidden"
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4704A] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8B9D83] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-[#E8C468]/20 text-[#D4704A] px-4 py-2 rounded-full text-sm font-semibold">
                🌟 Conectando o Agreste ao Mundo Digital
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Leve seu negócio do{" "}
              <span className="text-[#D4704A]">Parque das Feiras</span> para o
              mundo online
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Conecte comerciantes locais de Santa Cruz do Capibaribe com
              clientes de todo o Brasil. Crie sua loja online em minutos e
              comece a vender hoje mesmo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#D4704A] hover:bg-[#c05f3d] text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => router.push("/login")}
              >
                Entrar na Plataforma
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#8B9D83] text-[#8B9D83] hover:bg-[#8B9D83] hover:text-white text-lg px-8 py-6 transition-all"
                onClick={() => router.push("/lojas")}
              >
                Ver Lojas
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-[#D4704A]">500+</div>
                <div className="text-sm text-gray-600">Comerciantes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#8B9D83]">10k+</div>
                <div className="text-sm text-gray-600">Produtos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#E8C468]">24/7</div>
                <div className="text-sm text-gray-600">Suporte</div>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Loja de roupas"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4704A]/20 to-transparent"></div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B9D83] rounded-full flex items-center justify-center text-white text-xl font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Fácil de usar
                  </div>
                  <div className="text-sm text-gray-600">
                    Configure em minutos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}