"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciais de administrador
    if (email === "admin@agresteconectado.com" && password === "Admin@2024") {
      // Salvar sessão
      localStorage.setItem("isAdmin", "true");
      router.push("/admin");
    } else {
      setError("Email ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#f5ede3] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#D4704A] mb-2">
            Agreste Conectado
          </h1>
          <p className="text-gray-600">Área Administrativa</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@agresteconectado.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#D4704A] hover:bg-[#c05f3d] text-white py-6"
          >
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-[#D4704A]"
          >
            ← Voltar para o site
          </button>
        </div>

        <div className="mt-8 p-4 bg-[#E8C468]/10 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">
            Credenciais de Teste:
          </p>
          <p className="text-xs text-gray-700">
            <strong>Email:</strong> admin@agresteconectado.com
          </p>
          <p className="text-xs text-gray-700">
            <strong>Senha:</strong> Admin@2024
          </p>
        </div>
      </Card>
    </div>
  );
}
