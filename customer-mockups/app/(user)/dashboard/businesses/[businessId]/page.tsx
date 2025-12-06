import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusinessCard } from "@/components/customer/business-card"
import { PointsBadge } from "@/components/customer/points-badge"
import { LedgerTimeline } from "@/components/customer/ledger-timeline"
import { BusinessRewardsTab } from "@/components/customer/business-rewards-tab"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  mockBusinesses,
  mockCustomerBusinesses,
  mockLoyaltyConfigs,
  mockPointsLedger,
  mockPurchases,
  mockRedeems,
  mockRewards,
  currentCustomer,
} from "@/lib/mock-data"

export default function BusinessDetailPage({ params }: { params: { businessId: string } }) {
  const business = mockBusinesses.find((b) => b.id === params.businessId)
  if (!business) notFound()

  const customerBusiness = mockCustomerBusinesses.find(
    (cb) => cb.business_id === params.businessId && cb.customer_id === currentCustomer.id,
  )
  const currentPoints = customerBusiness?.cached_points || 0

  const loyaltyConfig = mockLoyaltyConfigs.find((lc) => lc.business_id === params.businessId)

  const ledgerEntries = mockPointsLedger.filter(
    (entry) => entry.business_id === params.businessId && entry.customer_id === currentCustomer.id,
  )

  const purchases = mockPurchases.filter(
    (p) => p.business_id === params.businessId && p.customer_id === currentCustomer.id,
  )

  const redeems = mockRedeems.filter((r) => r.business_id === params.businessId && r.customer_id === currentCustomer.id)

  const businessRewards = mockRewards.filter((r) => r.business_id === params.businessId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{business.name}</h2>
        <p className="text-muted-foreground">Detalles y puntos en este comercio</p>
      </div>

      <PointsBadge points={currentPoints} businessName={business.name} size="lg" />

      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="puntos">Mis Puntos</TabsTrigger>
          <TabsTrigger value="recompensas">Recompensas</TabsTrigger>
          <TabsTrigger value="compras">Compras</TabsTrigger>
          <TabsTrigger value="canjes">Canjes</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <BusinessCard business={business} showActions={false} />

          {loyaltyConfig && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="size-5 text-primary" />
                  Programa de Puntos
                </CardTitle>
                <CardDescription>Cómo funcionan los puntos en este comercio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Cada ${loyaltyConfig.baseAmount}</span>
                  <Badge variant="default">+{loyaltyConfig.pointsAwarded} puntos</Badge>
                </div>
                {loyaltyConfig.welcomeEnabled && loyaltyConfig.welcomePoints && (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm text-muted-foreground">Bonus de bienvenida</span>
                    <Badge variant="secondary">+{loyaltyConfig.welcomePoints} puntos</Badge>
                  </div>
                )}
                {loyaltyConfig.expirationEnabled && loyaltyConfig.expirationDays && (
                  <Alert>
                    <AlertCircle className="size-4" />
                    <AlertTitle>Expiración de Puntos</AlertTitle>
                    <AlertDescription>
                      Los puntos expiran después de {loyaltyConfig.expirationDays} días sin actividad
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total Compras</p>
                  <p className="text-2xl font-bold">{purchases.length}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total Canjes</p>
                  <p className="text-2xl font-bold">{redeems.length}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Puntos Actuales</p>
                  <p className="text-2xl font-bold text-primary">{currentPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="puntos">
          <LedgerTimeline entries={ledgerEntries} title="Movimientos de Puntos" />
        </TabsContent>

        <TabsContent value="recompensas">
          <BusinessRewardsTab
            rewards={businessRewards}
            currentPoints={currentPoints}
            business={business}
            loyaltyConfig={loyaltyConfig}
          />
        </TabsContent>

        <TabsContent value="compras">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Compras</CardTitle>
              <CardDescription>Compras realizadas en {business.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="mb-2 size-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay compras registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchases
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((purchase) => (
                      <div key={purchase.id} className="flex items-start justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">${purchase.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {purchase.paymentMethod} • +{purchase.points} puntos
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(purchase.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {purchase.isVoided && <Badge variant="destructive">Anulada</Badge>}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canjes">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Canjes</CardTitle>
              <CardDescription>Recompensas canjeadas en {business.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {redeems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="mb-2 size-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay canjes registrados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {redeems
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((redeem) => {
                      const reward = mockRewards.find((r) => r.id === redeem.reward_id)
                      return (
                        <div key={redeem.id} className="flex items-start justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{reward?.name}</p>
                            <p className="text-sm text-muted-foreground">-{redeem.pointsUsed} puntos</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(redeem.createdAt).toLocaleString()}
                            </p>
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
