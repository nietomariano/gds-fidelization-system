import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Gift, Award } from "lucide-react"
import { DashboardService } from "@/api/business/dashboard/dashboard.service"
import type { DashboardStats } from "@/api/business/dashboard/dashboard.types"

const dashboardService = new DashboardService()

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardService.getStats()
        setStats(response.data)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(1)}%`
  }

  const statsConfig = [
    {
      title: "Clientes Activos",
      value: stats?.activeCustomers.toLocaleString() || "0",
      change: formatChange(stats?.activeCustomersChange || 0),
      icon: Users,
      description: "vs. mes anterior",
    },
    {
      title: "Puntos Otorgados",
      value: stats?.pointsAwarded.toLocaleString() || "0",
      change: formatChange(stats?.pointsAwardedChange || 0),
      icon: Award,
      description: "este mes",
    },
    {
      title: "Recompensas Canjeadas",
      value: stats?.rewardsRedeemed.toLocaleString() || "0",
      change: formatChange(stats?.rewardsRedeemedChange || 0),
      icon: Gift,
      description: "este mes",
    },
    {
      title: "Tasa de Retención",
      value: `${stats?.retentionRate || 0}%`,
      change: "--",
      icon: TrendingUp,
      description: "clientes recurrentes",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-24 mb-2" />
                <div className="h-8 bg-muted rounded w-16 mb-2" />
                <div className="h-3 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-accent">{stat.change}</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-sm font-medium text-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
