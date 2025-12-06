import { BusinessCard } from "@/components/customer/business-card"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Store } from "lucide-react"
import { mockBusinesses, mockCustomerBusinesses } from "@/lib/mock-data"

export default function BusinessesPage() {
  // Get businesses where customer has interacted
  const businessesWithPoints = mockCustomerBusinesses
    .map((cb) => {
      const business = mockBusinesses.find((b) => b.id === cb.business_id)
      return business ? { business, points: cb.cached_points } : null
    })
    .filter((b) => b !== null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mis Comercios</h2>
        <p className="text-muted-foreground">Comercios donde tienes puntos acumulados</p>
      </div>

      {businessesWithPoints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Store className="mb-4 size-16 text-muted-foreground" />
            <CardTitle className="mb-2">No tienes comercios aún</CardTitle>
            <CardDescription>Comienza a acumular puntos en tus comercios favoritos</CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {businessesWithPoints.map(({ business, points }) => (
            <BusinessCard key={business.id} business={business} points={points} showPoints />
          ))}
        </div>
      )}
    </div>
  )
}
