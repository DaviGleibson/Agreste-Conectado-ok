"use client";

import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contato" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Agreste Conectado
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Conectando comerciantes do Parque das Feiras em Santa Cruz do
              Capibaribe com clientes de todo o Brasil. Transforme seu negócio
              local em uma loja online de sucesso.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#D4704A]" />
                <span className="text-sm">
                  Parque das Feiras, Santa Cruz do Capibaribe - PE
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#D4704A]" />
                <span className="text-sm">(81) 9 9999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#D4704A]" />
                <span className="text-sm">contato@agresteconectado.com.br</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="hover:text-[#D4704A] transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("como-funciona")}
                  className="hover:text-[#D4704A] transition-colors"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("planos")}
                  className="hover:text-[#D4704A] transition-colors"
                >
                  Planos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contato")}
                  className="hover:text-[#D4704A] transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Redes Sociais
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Siga-nos nas redes sociais e fique por dentro das novidades
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D4704A] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D4704A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D4704A] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2024 Agreste Conectado. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-[#D4704A] transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-[#D4704A] transition-colors">
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}