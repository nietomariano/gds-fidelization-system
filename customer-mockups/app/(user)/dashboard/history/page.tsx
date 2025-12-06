import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ShoppingBag, Gift } from "lucide-react"
import { mockBusinesses, mockPurchases, mockRedeems, mockRewards, currentCustomer } from "@/lib/mock-data"

export default function HistoryPage() {
  // Filter by current customer
  const purchases = mockPurchases
    .filter((p) => p.customer_id === currentCustomer.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const redeems = mockRedeems
    .filter((r) => r.customer_id === currentCustomer.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Historial</h2>
        <p className="text-muted-foreground">Todas tus compras y canjes en un solo lugar</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="purchases">Compras</TabsTrigger>
            <TabsTrigger value="redeems">Canjes</TabsTrigger>
          </TabsList>

          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por comercio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los comercios</SelectItem>
              {mockBusinesses.map((business) => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Completa</CardTitle>
              <CardDescription>Todas tus transacciones ordenadas por fecha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  ...purchases.map((p) => ({ ...p, type: "purchase" })),
                  ...redeems.map((r) => ({ ...r, type: "redeem" })),
                ]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((item) => {
                    const business = mockBusinesses.find((b) => b.id === item.business_id)
                    const isPurchase = item.type === "purchase"

                    return (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-start justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex size-10 items-center justify-center rounded-full ${
                              isPurchase ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {isPurchase ? <ShoppingBag className="size-5" /> : <Gift className="size-5" />}
                          </div>
                          <div>
                            <p className="font-medium">{business?.name}</p>
                            {isPurchase ? (
                              <p className="text-sm text-muted-foreground">
                                Compra: ${(item as any).amount.toFixed(2)} • +{(item as any).points} pts
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Canje: {mockRewards.find((r) => r.id === (item as any).reward_id)?.name} • -
                                {(item as any).pointsUsed} pts
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <Badge variant={isPurchase ? "default" : "secondary"}>{isPurchase ? "Compra" : "Canje"}</Badge>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Compras</CardTitle>
              <CardDescription>Todas tus compras realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="mb-4 size-16 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay compras registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase) => {
                    const business = mockBusinesses.find((b) => b.id === purchase.business_id)
                    return (
                      <div key={purchase.id} className="flex items-start justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <ShoppingBag className="size-5" />
                          </div>
                          <div>
                            <p className="font-medium">{business?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${purchase.amount.toFixed(2)} • {purchase.paymentMethod} • +{purchase.points} pts
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(purchase.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {purchase.isVoided && <Badge variant="destructive">Anulada</Badge>}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redeems">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Canjes</CardTitle>
              <CardDescription>Todas tus recompensas canjeadas</CardDescription>
            </CardHeader>
            <CardContent>
              {redeems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="mb-4 size-16 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay canjes registrados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {redeems.map((redeem) => {
                    const business = mockBusinesses.find((b) => b.id === redeem.business_id)
                    const reward = mockRewards.find((r) => r.id === redeem.reward_id)
                    return (
                      <div key={redeem.id} className="flex items-start justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <Gift className="size-5" />
                          </div>
                          <div>
                            <p className="font-medium">{business?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {reward?.name} • -{redeem.pointsUsed} pts
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(redeem.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Canjeado</Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
