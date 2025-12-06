import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, TrendingUp, Gift, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  mockBusinesses,
  mockCustomerBusinesses,
  mockPurchases,
  mockRedeems,
  mockRewards,
  currentCustomer,
} from "@/lib/mock-data"

export default function DashboardPage() {
  // Get businesses where customer has points
  const businessesWithPoints = mockCustomerBusinesses
    .map((cb) => {
      const business = mockBusinesses.find((b) => b.id === cb.business_id)
      return business ? { ...business, points: cb.cached_points } : null
    })
    .filter((b) => b !== null)

  // Recent purchases (last 3)
  const recentPurchases = [...mockPurchases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  // Recent redeems (last 3)
  const recentRedeems = [...mockRedeems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  // Total businesses count
  const totalBusinesses = businessesWithPoints.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido, {currentCustomer.name}</h2>
        <p className="text-muted-foreground">Resumen de tus puntos y actividad reciente</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comercios Activos</CardTitle>
            <Store className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">Comercios con puntos acumulados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Este Mes</CardTitle>
            <ShoppingBag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPurchases.length}</div>
            <p className="text-xs text-muted-foreground">Transacciones realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canjes Realizados</CardTitle>
            <Gift className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRedeems.length}</div>
            <p className="text-xs text-muted-foreground">Recompensas canjeadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Points by Business */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                Mis Puntos por Comercio
              </CardTitle>
              <CardDescription>Puntos acumulados en cada comercio</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/businesses">
                Ver todos
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {businessesWithPoints.map((business) => (
              <Link key={business.id} href={`/dashboard/businesses/${business.id}`}>
                <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={business.profilePicture || "/placeholder.svg?height=40&width=40"}
                      alt={business.name}
                      className="size-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{business.name}</p>
                      <p className="text-xs text-muted-foreground">{business.address}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-primary text-lg">
                    {business.points} pts
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Últimas Compras</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/history">Ver todo</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPurchases.map((purchase) => {
                const business = mockBusinesses.find((b) => b.id === purchase.business_id)
                return (
                  <div key={purchase.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{business?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${purchase.amount.toFixed(2)} • +{purchase.points} pts
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(purchase.createdAt).toLocaleDateString()}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Redeems */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Últimos Canjes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/history">Ver todo</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRedeems.map((redeem) => {
                const business = mockBusinesses.find((b) => b.id === redeem.business_id)
                const reward = mockRewards.find((r) => r.id === redeem.reward_id)
                return (
                  <div key={redeem.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{reward?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {business?.name} • -{redeem.pointsUsed} pts
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(redeem.createdAt).toLocaleDateString()}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
