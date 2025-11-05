"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-[#D4704A]">
              Agreste Conectado
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-gray-700 hover:text-[#D4704A] transition-colors font-medium"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-gray-700 hover:text-[#D4704A] transition-colors font-medium"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection("planos")}
              className="text-gray-700 hover:text-[#D4704A] transition-colors font-medium"
            >
              Planos
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="text-gray-700 hover:text-[#D4704A] transition-colors font-medium"
            >
              Contato
            </button>
            <Button
              className="bg-[#D4704A] hover:bg-[#c05f3d] text-white"
              onClick={() => router.push("/login")}
            >
              Entrar
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#D4704A]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <button
              onClick={() => scrollToSection("inicio")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#FAF7F2] rounded-md"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#FAF7F2] rounded-md"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection("planos")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#FAF7F2] rounded-md"
            >
              Planos
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#FAF7F2] rounded-md"
            >
              Contato
            </button>
            <div className="px-4 pt-2">
              <Button
                className="w-full bg-[#D4704A] hover:bg-[#c05f3d] text-white"
                onClick={() => router.push("/login")}
              >
                Entrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}