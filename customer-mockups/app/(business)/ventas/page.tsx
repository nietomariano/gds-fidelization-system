"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Plus, Search, Filter, Calendar, UserPlus, Check, Gift } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Cliente = {
  nombre: string
  telefono: string
  puntosAcumulados: number
}

type Venta = {
  id: string
  fecha: string
  hora: string
  cliente: string
  telefono: string
  monto: number
  puntos: number
  metodoPago: string
}

type Recompensa = {
  id: string
  name: string
  points: number
}

export default function VentasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([
    { nombre: "María González", telefono: "+54 11 2345-6789", puntosAcumulados: 450 },
    { nombre: "Juan Pérez", telefono: "+54 11 3456-7890", puntosAcumulados: 180 },
    { nombre: "Ana Martínez", telefono: "+54 11 4567-8901", puntosAcumulados: 620 },
    { nombre: "Carlos López", telefono: "+54 11 5678-9012", puntosAcumulados: 95 },
    { nombre: "Laura Rodríguez", telefono: "+54 11 6789-0123", puntosAcumulados: 310 },
  ])

  const [ventas, setVentas] = useState<Venta[]>([
    {
      id: "V-001",
      fecha: "2025-01-15",
      hora: "14:30",
      cliente: "María González",
      telefono: "+54 11 2345-6789",
      monto: 15000,
      puntos: 150,
      metodoPago: "Tarjeta",
    },
    {
      id: "V-002",
      fecha: "2025-01-15",
      hora: "16:45",
      cliente: "Juan Pérez",
      telefono: "+54 11 3456-7890",
      monto: 8500,
      puntos: 85,
      metodoPago: "Efectivo",
    },
    {
      id: "V-003",
      fecha: "2025-01-14",
      hora: "11:20",
      cliente: "Ana Martínez",
      telefono: "+54 11 4567-8901",
      monto: 22000,
      puntos: 220,
      metodoPago: "Transferencia",
    },
    {
      id: "V-004",
      fecha: "2025-01-14",
      hora: "18:15",
      cliente: "Carlos López",
      telefono: "+54 11 5678-9012",
      monto: 12500,
      puntos: 125,
      metodoPago: "Tarjeta",
    },
    {
      id: "V-005",
      fecha: "2025-01-13",
      hora: "10:00",
      cliente: "Laura Rodríguez",
      telefono: "+54 11 6789-0123",
      monto: 5000,
      puntos: 50,
      metodoPago: "Efectivo",
    },
  ])

  const [recompensas] = useState<Recompensa[]>([
    { id: "1", name: "Café gratis", points: 100 },
    { id: "2", name: "10% de descuento", points: 250 },
    { id: "3", name: "Producto gratis", points: 500 },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroMetodoPago, setFiltroMetodoPago] = useState("todos")

  const [openClienteCombobox, setOpenClienteCombobox] = useState(false)
  const [mostrarFormNuevoCliente, setMostrarFormNuevoCliente] = useState(false)
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", telefono: "", puntosAcumulados: 0 })

  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: "",
    monto: "",
    metodoPago: "efectivo",
  })

  const handleAgregarCliente = () => {
    if (!nuevoCliente.nombre || !nuevoCliente.telefono) return

    setClientes([...clientes, nuevoCliente])
    setNuevaVenta({ ...nuevaVenta, cliente: nuevoCliente.nombre })
    setNuevoCliente({ nombre: "", telefono: "", puntosAcumulados: 0 })
    setMostrarFormNuevoCliente(false)
    setOpenClienteCombobox(false)
  }

  const handleCrearVenta = () => {
    if (!nuevaVenta.cliente || !nuevaVenta.monto) return

    const monto = Number.parseFloat(nuevaVenta.monto)
    const puntos = Math.floor(monto / 100)

    const now = new Date()
    const fecha = now.toISOString().split("T")[0]
    const hora = now.toTimeString().slice(0, 5)

    const clienteSeleccionado = clientes.find((c) => c.nombre === nuevaVenta.cliente)

    const venta: Venta = {
      id: `V-${String(ventas.length + 1).padStart(3, "0")}`,
      fecha,
      hora,
      cliente: nuevaVenta.cliente,
      telefono: clienteSeleccionado?.telefono || "",
      monto,
      puntos,
      metodoPago:
        nuevaVenta.metodoPago === "efectivo"
          ? "Efectivo"
          : nuevaVenta.metodoPago === "tarjeta"
            ? "Tarjeta"
            : "Transferencia",
    }

    setVentas([venta, ...ventas])
    setNuevaVenta({ cliente: "", monto: "", metodoPago: "efectivo" })
    setIsDialogOpen(false)
  }

  const ventasFiltradas = ventas.filter((venta) => {
    const matchSearch =
      venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.telefono.includes(searchTerm)
    const matchFecha = !filtroFecha || venta.fecha === filtroFecha
    const matchMetodo =
      filtroMetodoPago === "todos" || venta.metodoPago.toLowerCase() === filtroMetodoPago.toLowerCase()

    return matchSearch && matchFecha && matchMetodo
  })

  const totalVentas = ventasFiltradas.reduce((sum, v) => sum + v.monto, 0)
  const totalPuntos = ventasFiltradas.reduce((sum, v) => sum + v.puntos, 0)

  const getRecompensasDisponibles = (clienteNombre: string) => {
    const cliente = clientes.find((c) => c.nombre === clienteNombre)
    if (!cliente) return []

    return recompensas.filter((r) => r.points <= cliente.puntosAcumulados)
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Ventas</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Registra ventas y asigna puntos a tus clientes
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Registrar Venta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Nueva Venta</DialogTitle>
                  <DialogDescription>Completa los datos de la venta para asignar puntos al cliente</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Popover open={openClienteCombobox} onOpenChange={setOpenClienteCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openClienteCombobox}
                          className="w-full justify-between bg-transparent"
                        >
                          {nuevaVenta.cliente || "Buscar por nombre o teléfono..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandList>
                            <CommandEmpty>
                              <div className="p-2 text-center">
                                <p className="text-sm text-muted-foreground mb-3">Cliente no encontrado</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2 bg-transparent"
                                  onClick={() => setMostrarFormNuevoCliente(true)}
                                >
                                  <UserPlus className="h-4 w-4" />
                                  Agregar nuevo cliente
                                </Button>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {clientes.map((cliente) => (
                                <CommandItem
                                  key={cliente.telefono}
                                  value={`${cliente.nombre} ${cliente.telefono}`}
                                  onSelect={() => {
                                    setNuevaVenta({ ...nuevaVenta, cliente: cliente.nombre })
                                    setOpenClienteCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${nuevaVenta.cliente === cliente.nombre ? "opacity-100" : "opacity-0"}`}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{cliente.nombre}</span>
                                    <span className="text-xs text-muted-foreground">{cliente.telefono}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {nuevaVenta.cliente && getRecompensasDisponibles(nuevaVenta.cliente).length > 0 && (
                    <Card className="p-4 bg-accent/30 border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Gift className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm text-foreground">Beneficios disponibles</h3>
                      </div>
                      <div className="space-y-2">
                        {getRecompensasDisponibles(nuevaVenta.cliente).map((recompensa) => (
                          <div
                            key={recompensa.id}
                            className="flex items-center justify-between p-2 rounded-md bg-background/50"
                          >
                            <span className="text-sm font-medium text-foreground">{recompensa.name}</span>
                            <span className="text-xs text-muted-foreground">{recompensa.points} pts</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Puntos actuales:{" "}
                        <span className="font-semibold text-foreground">
                          {clientes.find((c) => c.nombre === nuevaVenta.cliente)?.puntosAcumulados} pts
                        </span>
                      </p>
                    </Card>
                  )}

                  {mostrarFormNuevoCliente && (
                    <Card className="p-4 space-y-3 border-primary/20 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Nuevo Cliente</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setMostrarFormNuevoCliente(false)
                            setNuevoCliente({ nombre: "", telefono: "", puntosAcumulados: 0 })
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nuevo-nombre">Nombre</Label>
                        <Input
                          id="nuevo-nombre"
                          placeholder="Nombre completo"
                          value={nuevoCliente.nombre}
                          onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nuevo-telefono">Teléfono</Label>
                        <Input
                          id="nuevo-telefono"
                          placeholder="+54 11 1234-5678"
                          value={nuevoCliente.telefono}
                          onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAgregarCliente} className="w-full gap-2" size="sm">
                        <UserPlus className="h-4 w-4" />
                        Agregar Cliente
                      </Button>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto ($)</Label>
                    <Input
                      id="monto"
                      type="number"
                      placeholder="0.00"
                      value={nuevaVenta.monto}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, monto: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metodoPago">Método de Pago</Label>
                    <Select
                      value={nuevaVenta.metodoPago}
                      onValueChange={(value) => setNuevaVenta({ ...nuevaVenta, metodoPago: value })}
                    >
                      <SelectTrigger id="metodoPago">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {nuevaVenta.monto && (
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-sm text-muted-foreground">Puntos a otorgar:</p>
                      <p className="text-2xl font-bold text-foreground">
                        {Math.floor(Number.parseFloat(nuevaVenta.monto) / 100)} puntos
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCrearVenta}>Registrar Venta</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card className="p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Filtros</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cliente, teléfono o ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fecha"
                  type="date"
                  className="pl-9"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metodo">Método de Pago</Label>
              <Select value={filtroMetodoPago} onValueChange={setFiltroMetodoPago}>
                <SelectTrigger id="metodo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Ventas</p>
            <p className="text-2xl font-bold text-foreground">{ventasFiltradas.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Monto Total</p>
            <p className="text-2xl font-bold text-foreground">${totalVentas.toLocaleString()}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Puntos Otorgados</p>
            <p className="text-2xl font-bold text-foreground">{totalPuntos.toLocaleString()}</p>
          </Card>
        </div>

        <Card>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">Fecha</TableHead>
                      <TableHead className="whitespace-nowrap">Hora</TableHead>
                      <TableHead className="whitespace-nowrap">Cliente</TableHead>
                      <TableHead className="whitespace-nowrap">Teléfono</TableHead>
                      <TableHead className="whitespace-nowrap">Monto</TableHead>
                      <TableHead className="whitespace-nowrap">Puntos</TableHead>
                      <TableHead className="whitespace-nowrap">Método de Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ventasFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No se encontraron ventas
                        </TableCell>
                      </TableRow>
                    ) : (
                      ventasFiltradas.map((venta) => (
                        <TableRow key={venta.id}>
                          <TableCell className="font-medium whitespace-nowrap">{venta.id}</TableCell>
                          <TableCell className="whitespace-nowrap">{venta.fecha}</TableCell>
                          <TableCell className="whitespace-nowrap">{venta.hora}</TableCell>
                          <TableCell className="whitespace-nowrap">{venta.cliente}</TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">{venta.telefono}</TableCell>
                          <TableCell className="font-semibold whitespace-nowrap">
                            ${venta.monto.toLocaleString()}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                              +{venta.puntos} pts
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{venta.metodoPago}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
