import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Gift, UserPlus } from "lucide-react"
import { DashboardService } from "@/api/business/dashboard/dashboard.service"
import type { RecentActivity as RecentActivityType } from "@/api/business/dashboard/dashboard.types"

const dashboardService = new DashboardService()

const getIconForType = (type: string) => {
  switch (type) {
    case "venta":
      return ShoppingCart
    case "canje":
      return Gift
    case "cliente":
      return UserPlus
    default:
      return ShoppingCart
  }
}

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "venta":
      return "default" as const
    case "canje":
      return "secondary" as const
    case "cliente":
      return "outline" as const
    default:
      return "default" as const
  }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<RecentActivityType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardService.getRecentActivity()
        setActivities(response.data)
      } catch (error) {
        console.error("Error loading recent activity:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas transacciones y eventos del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4 rounded-lg border p-3">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-48" />
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
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas transacciones y eventos del sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getIconForType(activity.type)
            const badgeVariant = getBadgeVariant(activity.type)
            return (
              <div key={index} className="flex items-start gap-4 rounded-lg border p-3">
                <div className="rounded-full bg-muted p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant={badgeVariant}>{activity.badge}</Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
