import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardService } from "@/api/business/dashboard/dashboard.service"
import type { TopCustomer } from "@/api/business/dashboard/dashboard.types"

const dashboardService = new DashboardService()

export function TopCustomers() {
  const [customers, setCustomers] = useState<TopCustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardService.getTopCustomers()
        setCustomers(response.data)
      } catch (error) {
        console.error("Error loading top customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-500"
      case "Silver":
        return "bg-gray-400"
      case "Bronze":
        return "bg-orange-600"
      default:
        return "bg-muted"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Clientes</CardTitle>
          <CardDescription>Clientes con más puntos acumulados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Clientes</CardTitle>
        <CardDescription>Clientes con más puntos acumulados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.rank} className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                {customer.rank}
              </div>
              <Avatar>
                <AvatarFallback>{customer.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.visits} visitas</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{customer.points.toLocaleString()}</p>
                <Badge variant="secondary" className={`${getTierColor(customer.tier)} text-white text-xs`}>
                  {customer.tier}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
