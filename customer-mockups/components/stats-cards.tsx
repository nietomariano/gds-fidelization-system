import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Gift, Award } from "lucide-react"

const stats = [
  {
    title: "Clientes Activos",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "vs. mes anterior",
  },
  {
    title: "Puntos Otorgados",
    value: "45,892",
    change: "+8.2%",
    trend: "up",
    icon: Award,
    description: "este mes",
  },
  {
    title: "Recompensas Canjeadas",
    value: "328",
    change: "+15.3%",
    trend: "up",
    icon: Gift,
    description: "este mes",
  },
  {
    title: "Tasa de Retención",
    value: "68%",
    change: "+5.1%",
    trend: "up",
    icon: TrendingUp,
    description: "clientes recurrentes",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
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
