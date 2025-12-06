import { useState, useEffect } from "react"
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
import { Plus, Search, Filter, Calendar, UserPlus, Check, Gift, Loader2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PurchaseService } from "@/api/business/purchase/purchase.service"
import { CustomersService } from "@/api/business/customers/customers.service"
import { RewardsService } from "@/api/business/reward/reward.service"
import type { PurchaseModel } from "@/api/business/purchase/purchase.types"
import type { CustomerBusinessModel } from "@/api/types/Models/CustomerBusinessModel"
import type { RewardModel } from "@/api/types/Models/RewardModel"

// UI type for simplified customer display
type Cliente = {
  id: string
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

const purchaseService = new PurchaseService()
const customersService = new CustomersService()
const rewardsService = new RewardsService()

// Helper function to translate payment methods
const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    bank_transfer: 'Transferencia'
  }
  return labels[method] || method
}

function VentasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])
  const [recompensas, setRecompensas] = useState<RewardModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroMetodoPago, setFiltroMetodoPago] = useState("todos")

  const [openClienteCombobox, setOpenClienteCombobox] = useState(false)
  const [mostrarFormNuevoCliente, setMostrarFormNuevoCliente] = useState(false)
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", telefono: "" })

  const [nuevaVenta, setNuevaVenta] = useState({
    clienteId: "",
    clienteNombre: "",
    monto: "",
    metodoPago: "cash",
  })

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        const [purchasesRes, customersRes, rewardsRes] = await Promise.all([
          purchaseService.getPurchases({ per_page: 100 }),
          customersService.getCustomers({ per_page: 100 }),
          rewardsService.getRewards({ per_page: 100 })
        ])

        // Map purchases to Venta format
        const mappedPurchases: Venta[] = purchasesRes.data.purchases.map((p: PurchaseModel) => ({
          id: p.id,
          fecha: new Date(p.created_at).toISOString().split("T")[0],
          hora: new Date(p.created_at).toTimeString().slice(0, 5),
          cliente: p.customer ? `${p.customer.firstName} ${p.customer.lastName || ""}`.trim() : "N/A",
          telefono: p.customer?.phoneNumber || "",
          monto: p.amount,
          puntos: p.points,
          metodoPago: p.payment_method,
        }))

        // Map customers to Cliente format (from CustomerBusinessResource)
        console.log('Customers response:', customersRes)
        const customerData: CustomerBusinessModel[] = Array.isArray(customersRes.data) ? customersRes.data : []
        console.log('Customer data array:', customerData)
        
        const mappedClientes: Cliente[] = customerData
          .filter((cb) => cb?.customer) // Filter out items without customer
          .map((cb) => {
            const customer = cb.customer
            
            return {
              id: customer.id,
              nombre: `${customer.firstName} ${customer.lastName || ""}`.trim(),
              telefono: customer.phoneNumber,
              puntosAcumulados: cb.cachedPoints,
            }
          })
        
        console.log('Mapped clientes:', mappedClientes)

        setVentas(mappedPurchases)
        setClientes(mappedClientes)
        setRecompensas(rewardsRes.data.rewards)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAgregarCliente = async () => {
    if (!nuevoCliente.nombre || !nuevoCliente.telefono) return

    try {
      const [firstName, ...lastNameParts] = nuevoCliente.nombre.split(" ")
      const lastName = lastNameParts.join(" ")

      const response = await customersService.createCustomer({
        first_name: firstName,
        last_name: lastName || undefined,
        phone_number: nuevoCliente.telefono,
      })

      // Reload customers after creation
      const customersRes = await customersService.getCustomers({ per_page: 100 })
      const customerData: CustomerBusinessModel[] = Array.isArray(customersRes.data) ? customersRes.data : []
      const mappedClientes: Cliente[] = customerData
        .filter((cb) => cb?.customer) // Filter out items without customer
        .map((cb) => {
          const customer = cb.customer
          
          return {
            id: customer.id,
            nombre: `${customer.firstName} ${customer.lastName || ""}`.trim(),
            telefono: customer.phoneNumber,
            puntosAcumulados: cb.cachedPoints,
          }
        })
      
      setClientes(mappedClientes)
      const newCliente = mappedClientes.find(c => c.telefono === nuevoCliente.telefono)
      if (newCliente) {
        setNuevaVenta({ ...nuevaVenta, clienteId: newCliente.id, clienteNombre: newCliente.nombre })
      }
      
      setNuevoCliente({ nombre: "", telefono: "" })
      setMostrarFormNuevoCliente(false)
      setOpenClienteCombobox(false)
    } catch (error) {
      console.error("Error creating customer:", error)
    }
  }

  const handleCrearVenta = async () => {
    if (!nuevaVenta.clienteId || !nuevaVenta.monto) return

    try {
      setIsCreating(true)
      const monto = Number.parseFloat(nuevaVenta.monto)
      const puntos = Math.floor(monto / 100)

      await purchaseService.createPurchase({
        customer_id: nuevaVenta.clienteId,
        amount: monto,
        points: puntos,
        payment_method: nuevaVenta.metodoPago,
      })

      // Reload purchases and customers from server
      console.log('Recargando ventas y clientes...')
      const [purchasesRes, customersRes] = await Promise.all([
        purchaseService.getPurchases({ per_page: 100 }),
        customersService.getCustomers({ per_page: 100 })
      ])

      console.log('Respuesta de ventas:', purchasesRes)
      console.log('Respuesta de clientes:', customersRes)

      // Update purchases list
      const mappedPurchases: Venta[] = purchasesRes.data.purchases.map((p: PurchaseModel) => ({
        id: p.id,
        fecha: new Date(p.created_at).toISOString().split("T")[0],
        hora: new Date(p.created_at).toTimeString().slice(0, 5),
        cliente: p.customer ? `${p.customer.firstName} ${p.customer.lastName || ""}`.trim() : "N/A",
        telefono: p.customer?.phoneNumber || "",
        monto: p.amount,
        puntos: p.points,
        metodoPago: p.payment_method,
      }))

      // Update customers list
      const customerData: CustomerBusinessModel[] = Array.isArray(customersRes.data) ? customersRes.data : []
      const mappedClientes: Cliente[] = customerData
        .filter((cb) => cb?.customer)
        .map((cb) => {
          const customer = cb.customer
          return {
            id: customer.id,
            nombre: `${customer.firstName} ${customer.lastName || ""}`.trim(),
            telefono: customer.phoneNumber,
            puntosAcumulados: cb.cachedPoints,
          }
        })
      
      console.log('Ventas mapeadas:', mappedPurchases.length)
      console.log('Clientes mapeados:', mappedClientes.length)
      
      setVentas(mappedPurchases)
      setClientes(mappedClientes)
      
      console.log('Estado actualizado')
      
      // Reset form and close dialog with slight delay to ensure state updates
      setNuevaVenta({ clienteId: "", clienteNombre: "", monto: "", metodoPago: "cash" })
      
      // Use setTimeout to ensure state updates are processed before closing
      setTimeout(() => {
        setIsDialogOpen(false)
      }, 100)
    } catch (error) {
      console.error("Error creating purchase:", error)
      setIsDialogOpen(false)
    } finally {
      setIsCreating(false)
    }
  }

  const ventasFiltradas = ventas.filter((venta) => {
    const matchSearch =
      venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.telefono.includes(searchTerm)
    const matchFecha = !filtroFecha || venta.fecha === filtroFecha
    const matchMetodo =
      filtroMetodoPago === "todos" || venta.metodoPago === filtroMetodoPago

    return matchSearch && matchFecha && matchMetodo
  })

  const totalVentas = ventasFiltradas.reduce((sum, v) => sum + v.monto, 0)
  const totalPuntos = ventasFiltradas.reduce((sum, v) => sum + v.puntos, 0)

  const getRecompensasDisponibles = (clienteNombre: string) => {
    const cliente = clientes.find((c) => c.nombre === clienteNombre)
    if (!cliente) return []

    return recompensas.filter((r) => r.cost <= cliente.puntosAcumulados)
  }

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando ventas...</p>
        </div>
      </div>
    )
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
                          {nuevaVenta.clienteNombre || "Buscar por nombre o teléfono..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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
                                  key={cliente.id}
                                  value={`${cliente.nombre} ${cliente.telefono}`}
                                  onSelect={() => {
                                    setNuevaVenta({ ...nuevaVenta, clienteId: cliente.id, clienteNombre: cliente.nombre })
                                    setOpenClienteCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${nuevaVenta.clienteNombre === cliente.nombre ? "opacity-100" : "opacity-0"}`}
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

                  {nuevaVenta.clienteNombre && getRecompensasDisponibles(nuevaVenta.clienteNombre).length > 0 && (
                    <Card className="p-4 bg-accent/30 border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Gift className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm text-foreground">Beneficios disponibles</h3>
                      </div>
                      <div className="space-y-2">
                        {getRecompensasDisponibles(nuevaVenta.clienteNombre).map((recompensa) => (
                          <div
                            key={recompensa.id}
                            className="flex items-center justify-between p-2 rounded-md bg-background/50"
                          >
                            <span className="text-sm font-medium text-foreground">{recompensa.name}</span>
                            <span className="text-xs text-muted-foreground">{recompensa.cost} pts</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Puntos actuales:{" "}
                        <span className="font-semibold text-foreground">
                          {clientes.find((c) => c.id === nuevaVenta.clienteId)?.puntosAcumulados} pts
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
                            setNuevoCliente({ nombre: "", telefono: "" })
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
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="card">Tarjeta</SelectItem>
                        <SelectItem value="bank_transfer">Transferencia</SelectItem>
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCrearVenta} disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      "Registrar Venta"
                    )}
                  </Button>
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
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="bank_transfer">Transferencia</SelectItem>
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
                          <TableCell className="whitespace-nowrap">{getPaymentMethodLabel(venta.metodoPago)}</TableCell>
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

export default VentasPage;




