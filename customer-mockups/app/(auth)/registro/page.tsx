"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Store, TrendingUp, Users, Award, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function RegistroPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    setShowConfirmation(true)
  }

  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
    router.push("/login")
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
              Comienza a fidelizar clientes hoy mismo
            </h1>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Únete a cientos de negocios que ya están aumentando sus ventas y mejorando la retención de clientes con
              nuestro sistema de puntos.
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

      {/* Right side - Registration form */}
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
            <h2 className="text-3xl font-bold mb-2">Crea tu cuenta</h2>
            <p className="text-muted-foreground">Completa el formulario para comenzar gratis</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre del Negocio</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Mi Comercio"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Tu Nombre</Label>
              <Input
                id="ownerName"
                type="text"
                placeholder="Juan Pérez"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="h-11"
              />
            </div>

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
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+54 9 11 1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11" size="lg">
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Al registrarte, aceptas nuestros{" "}
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

      <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">¡Revisa tu email!</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Hemos enviado un correo de confirmación a <strong className="text-foreground">{email}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Haz clic en el enlace del correo para activar tu cuenta</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Si no lo ves, revisa tu carpeta de spam</p>
              </div>
            </div>
            <Button onClick={handleCloseConfirmation} className="w-full" size="lg">
              Ir al inicio de sesión
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
