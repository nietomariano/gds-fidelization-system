"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Store, TrendingUp, Users, Award } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero section with image and content */}
      <div className="hidden lg:flex lg:w-[70%] bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">FideliApp</span>
          </div>

          {/* Main content */}
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight text-balance">
              Fideliza a tus clientes y haz crecer tu negocio
            </h1>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Sistema de puntos y recompensas diseñado para pequeños comercios. Aumenta la retención de clientes y
              mejora tus ventas.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-colors">
                <Users className="w-8 h-8 mb-3 text-white" />
                <h3 className="font-semibold mb-2">Gestión de Clientes</h3>
                <p className="text-sm text-white/80">Control total de tu base de clientes</p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-colors">
                <TrendingUp className="w-8 h-8 mb-3 text-white" />
                <h3 className="font-semibold mb-2">Análisis en Tiempo Real</h3>
                <p className="text-sm text-white/80">Métricas y estadísticas detalladas</p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-colors">
                <Award className="w-8 h-8 mb-3 text-white" />
                <h3 className="font-semibold mb-2">Recompensas Personalizadas</h3>
                <p className="text-sm text-white/80">Crea beneficios únicos para tu negocio</p>
              </Card>
            </div>
          </div>

          {/* Footer stats */}
          <div className="flex gap-12">
            <div>
              <div className="text-4xl font-bold mb-1">500+</div>
              <div className="text-white/80">Negocios activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">50K+</div>
              <div className="text-white/80">Clientes fidelizados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">95%</div>
              <div className="text-white/80">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">FideliApp</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Bienvenido</h2>
            <p className="text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@negocio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/recuperar-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11" size="lg">
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/registro" className="text-primary font-medium hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Al iniciar sesión, aceptas nuestros{" "}
              <Link href="/terminos" className="underline hover:text-foreground">
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link href="/privacidad" className="underline hover:text-foreground">
                Política de Privacidad
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
