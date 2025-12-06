"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Pencil, Trash2, Phone, Mail, Calendar, TrendingUp } from "lucide-react"

type Customer = {
  id: string
  nombre: string
  apellido?: string
  telefono: string
  email?: string
  puntos: number
  visitas: number
  fechaRegistro: string
  ultimaVisita: string
  foto?: string
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      nombre: "María",
      apellido: "González",
      telefono: "+54 11 2345-6789",
      email: "maria.gonzalez@email.com",
      puntos: 2450,
      visitas: 28,
      fechaRegistro: "2024-01-15",
      ultimaVisita: "2025-01-10",
      foto: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      nombre: "Carlos",
      apellido: "Rodríguez",
      telefono: "+54 11 3456-7890",
      puntos: 1820,
      visitas: 19,
      fechaRegistro: "2024-02-20",
      ultimaVisita: "2025-01-08",
    },
    {
      id: "3",
      nombre: "Ana",
      apellido: "Martínez",
      telefono: "+54 11 4567-8901",
      email: "ana.m@email.com",
      puntos: 980,
      visitas: 12,
      fechaRegistro: "2024-03-10",
      ultimaVisita: "2025-01-05",
      foto: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      nombre: "Roberto",
      telefono: "+54 11 5678-9012",
      puntos: 450,
      visitas: 6,
      fechaRegistro: "2024-06-15",
      ultimaVisita: "2024-12-28",
    },
    {
      id: "5",
      nombre: "Laura",
      apellido: "Fernández",
      telefono: "+54 11 6789-0123",
      email: "laura.f@email.com",
      puntos: 3200,
      visitas: 35,
      fechaRegistro: "2023-11-05",
      ultimaVisita: "2025-01-12",
      foto: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  })

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telefono.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer)
      setFormData({
        nombre: customer.nombre,
        apellido: customer.apellido || "",
        telefono: customer.telefono,
        email: customer.email || "",
      })
    } else {
      setEditingCustomer(null)
      setFormData({ nombre: "", apellido: "", telefono: "", email: "" })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCustomer(null)
    setFormData({ nombre: "", apellido: "", telefono: "", email: "" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? { ...c, ...formData } : c)))
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        apellido: formData.apellido || undefined,
        telefono: formData.telefono,
        email: formData.email || undefined,
        puntos: 0,
        visitas: 0,
        fechaRegistro: new Date().toISOString().split("T")[0],
        ultimaVisita: new Date().toISOString().split("T")[0],
      }
      setCustomers([...customers, newCustomer])
    }

    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      setCustomers(customers.filter((c) => c.id !== id))
    }
  }

  const totalClientes = customers.length
  const totalPuntos = customers.reduce((sum, c) => sum + c.puntos, 0)
  const totalVisitas = customers.reduce((sum, c) => sum + c.visitas, 0)
  const promedioVisitas = totalClientes > 0 ? (totalVisitas / totalClientes).toFixed(1) : 0

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Clientes</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Gestiona tus clientes y su actividad de puntos
              </p>
            </div>
            <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cliente
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clientes</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalClientes}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Puntos Totales</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalPuntos.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Visitas</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalVisitas}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Promedio Visitas</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{promedioVisitas}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6 sm:py-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, teléfono o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground whitespace-nowrap py-4">
                    Cliente
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
                    Contacto
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
                    Puntos
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
                    Visitas
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
                    Última Visita
                  </th>
                  <th className="text-right p-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={customer.foto || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {customer.nombre[0]}
                              {customer.apellido?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {customer.nombre} {customer.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Desde {new Date(customer.fechaRegistro).toLocaleDateString("es-AR")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {customer.telefono}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-semibold text-foreground">{customer.puntos.toLocaleString()}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <p className="text-foreground">{customer.visitas}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <p className="text-sm text-muted-foreground">
                          {new Date(customer.ultimaVisita).toLocaleDateString("es-AR")}
                        </p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(customer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(customer.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Editar Cliente" : "Agregar Nuevo Cliente"}</DialogTitle>
            <DialogDescription>
              {editingCustomer ? "Modifica la información del cliente" : "Completa los datos del nuevo cliente"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">
                    Nombre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">{editingCustomer ? "Guardar Cambios" : "Agregar Cliente"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
