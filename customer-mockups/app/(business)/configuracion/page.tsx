"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, DollarSign, Gift, Calendar, TrendingUp, Store, Upload, Instagram, Facebook, Twitter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ConfiguracionPage() {
  const [businessProfile, setBusinessProfile] = useState({
    nombre: "FideliApp",
    logo: "/placeholder.svg?height=100&width=100",
    email: "contacto@fideliapp.com",
    telefono: "+54 11 1234-5678",
    direccion: "Av. Corrientes 1234, CABA, Argentina",
    instagram: "@fideliapp",
    facebook: "fideliapp",
    twitter: "@fideliapp",
  })

  const [config, setConfig] = useState({
    // Conversión de puntos
    montoBase: 100,
    puntosOtorgados: 1,

    // Puntos de bienvenida
    puntosRegistro: 50,
    habilitarPuntosRegistro: true,

    // Expiración
    puntosExpiran: false,
    mesesExpiracion: 12,

    // Multiplicadores
    habilitarMultiplicadores: false,
    multiplicadorFinde: 2,

    // Redondeo
    tipoRedondeo: "ninguno" as "ninguno" | "arriba" | "abajo",
  })

  const handleSave = () => {
    // Aquí se guardaría la configuración
    alert("Configuración guardada exitosamente")
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBusinessProfile({ ...businessProfile, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Configuración</h1>
              <p className="text-muted-foreground mt-1">Personaliza tu negocio y el sistema de puntos de fidelidad</p>
            </div>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-6 max-w-4xl">
          {/* Business Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Perfil del Negocio</CardTitle>
                  <CardDescription>Información básica de tu comercio</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo */}
              <div className="space-y-2">
                <Label>Logo del Negocio</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={businessProfile.logo || "/placeholder.svg"} alt={businessProfile.nombre} />
                    <AvatarFallback>{businessProfile.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("logo-upload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Cambiar Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">Formato JPG, PNG o SVG. Máximo 2MB</p>
                  </div>
                </div>
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombreNegocio">Nombre del Negocio</Label>
                <Input
                  id="nombreNegocio"
                  value={businessProfile.nombre}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, nombre: e.target.value })}
                  placeholder="Ej: Mi Comercio"
                />
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailNegocio">Email</Label>
                  <Input
                    id="emailNegocio"
                    type="email"
                    value={businessProfile.email}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, email: e.target.value })}
                    placeholder="contacto@negocio.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefonoNegocio">Teléfono</Label>
                  <Input
                    id="telefonoNegocio"
                    type="tel"
                    value={businessProfile.telefono}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, telefono: e.target.value })}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="direccionNegocio">Dirección</Label>
                <Textarea
                  id="direccionNegocio"
                  value={businessProfile.direccion}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, direccion: e.target.value })}
                  placeholder="Calle, número, ciudad, provincia"
                  rows={2}
                />
              </div>

              {/* Redes Sociales */}
              <div className="space-y-4">
                <Label>Redes Sociales</Label>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-muted-foreground" />
                    <Input
                      value={businessProfile.instagram}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, instagram: e.target.value })}
                      placeholder="@usuario"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-muted-foreground" />
                    <Input
                      value={businessProfile.facebook}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, facebook: e.target.value })}
                      placeholder="usuario"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-muted-foreground" />
                    <Input
                      value={businessProfile.twitter}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, twitter: e.target.value })}
                      placeholder="@usuario"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversión de Puntos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Conversión de Puntos</CardTitle>
                  <CardDescription>Define cómo se convierten las compras en puntos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="montoBase">Monto Base ($)</Label>
                  <Input
                    id="montoBase"
                    type="number"
                    value={config.montoBase}
                    onChange={(e) => setConfig({ ...config, montoBase: Number(e.target.value) })}
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">Cada cuántos pesos se otorgan puntos</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="puntosOtorgados">Puntos Otorgados</Label>
                  <Input
                    id="puntosOtorgados"
                    type="number"
                    value={config.puntosOtorgados}
                    onChange={(e) => setConfig({ ...config, puntosOtorgados: Number(e.target.value) })}
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">Puntos por cada monto base</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium">
                  Configuración actual: <span className="text-primary">{config.puntosOtorgados} punto(s)</span> por cada{" "}
                  <span className="text-primary">${config.montoBase}</span> gastados
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ejemplo: Una compra de $500 otorgará {Math.floor(500 / config.montoBase) * config.puntosOtorgados}{" "}
                  puntos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Puntos de Bienvenida */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Puntos de Bienvenida</CardTitle>
                  <CardDescription>Recompensa a nuevos clientes al registrarse</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="habilitarPuntosRegistro">Habilitar puntos de registro</Label>
                  <p className="text-xs text-muted-foreground">Otorgar puntos automáticamente a nuevos clientes</p>
                </div>
                <Switch
                  id="habilitarPuntosRegistro"
                  checked={config.habilitarPuntosRegistro}
                  onCheckedChange={(checked) => setConfig({ ...config, habilitarPuntosRegistro: checked })}
                />
              </div>
              {config.habilitarPuntosRegistro && (
                <div className="space-y-2">
                  <Label htmlFor="puntosRegistro">Puntos de Registro</Label>
                  <Input
                    id="puntosRegistro"
                    type="number"
                    value={config.puntosRegistro}
                    onChange={(e) => setConfig({ ...config, puntosRegistro: Number(e.target.value) })}
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">Puntos que recibirá cada nuevo cliente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expiración de Puntos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Expiración de Puntos</CardTitle>
                  <CardDescription>Configura si los puntos tienen fecha de vencimiento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="puntosExpiran">Los puntos expiran</Label>
                  <p className="text-xs text-muted-foreground">Establecer un período de validez para los puntos</p>
                </div>
                <Switch
                  id="puntosExpiran"
                  checked={config.puntosExpiran}
                  onCheckedChange={(checked) => setConfig({ ...config, puntosExpiran: checked })}
                />
              </div>
              {config.puntosExpiran && (
                <div className="space-y-2">
                  <Label htmlFor="mesesExpiracion">Meses hasta expiración</Label>
                  <Input
                    id="mesesExpiracion"
                    type="number"
                    value={config.mesesExpiracion}
                    onChange={(e) => setConfig({ ...config, mesesExpiracion: Number(e.target.value) })}
                    min="1"
                    max="60"
                  />
                  <p className="text-xs text-muted-foreground">Los puntos expirarán después de este período</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Multiplicadores */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Multiplicadores de Puntos</CardTitle>
                  <CardDescription>Ofrece puntos extra en días especiales</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="habilitarMultiplicadores">Habilitar multiplicadores</Label>
                  <p className="text-xs text-muted-foreground">Activar puntos extra en fines de semana</p>
                </div>
                <Switch
                  id="habilitarMultiplicadores"
                  checked={config.habilitarMultiplicadores}
                  onCheckedChange={(checked) => setConfig({ ...config, habilitarMultiplicadores: checked })}
                />
              </div>
              {config.habilitarMultiplicadores && (
                <div className="space-y-2">
                  <Label htmlFor="multiplicadorFinde">Multiplicador de fin de semana</Label>
                  <Select
                    value={config.multiplicadorFinde.toString()}
                    onValueChange={(value) => setConfig({ ...config, multiplicadorFinde: Number(value) })}
                  >
                    <SelectTrigger id="multiplicadorFinde">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.5">1.5x (50% más puntos)</SelectItem>
                      <SelectItem value="2">2x (Doble de puntos)</SelectItem>
                      <SelectItem value="3">3x (Triple de puntos)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Sábados y domingos otorgarán más puntos</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Redondeo */}
          <Card>
            <CardHeader>
              <CardTitle>Redondeo de Puntos</CardTitle>
              <CardDescription>Define cómo se redondean los puntos decimales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="tipoRedondeo">Tipo de redondeo</Label>
                <Select
                  value={config.tipoRedondeo}
                  onValueChange={(value: "ninguno" | "arriba" | "abajo") =>
                    setConfig({ ...config, tipoRedondeo: value })
                  }
                >
                  <SelectTrigger id="tipoRedondeo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninguno">Sin redondeo (decimales exactos)</SelectItem>
                    <SelectItem value="abajo">Redondear hacia abajo</SelectItem>
                    <SelectItem value="arriba">Redondear hacia arriba (favorece al cliente)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {config.tipoRedondeo === "ninguno" && "Ejemplo: 2.7 puntos se guardan como 2.7"}
                  {config.tipoRedondeo === "abajo" && "Ejemplo: 2.7 puntos se convierten en 2"}
                  {config.tipoRedondeo === "arriba" && "Ejemplo: 2.7 puntos se convierten en 3"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
