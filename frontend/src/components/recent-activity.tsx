import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Gift, UserPlus, TrendingUp } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "points",
    customer: "María González",
    description: "Ganó 150 puntos por compra de $3,000",
    time: "Hace 5 minutos",
    icon: Award,
    color: "text-primary",
  },
  {
    id: 2,
    type: "reward",
    customer: "Carlos Ruiz",
    description: 'Canjeó "Descuento 10%" (500 puntos)',
    time: "Hace 12 minutos",
    icon: Gift,
    color: "text-accent",
  },
  {
    id: 3,
    type: "signup",
    customer: "Ana Martínez",
    description: "Se registró en el programa de fidelización",
    time: "Hace 23 minutos",
    icon: UserPlus,
    color: "text-chart-3",
  },
  {
    id: 4,
    type: "points",
    customer: "Luis Hernández",
    description: "Ganó 200 puntos por compra de $4,000",
    time: "Hace 35 minutos",
    icon: Award,
    color: "text-primary",
  },
  {
    id: 5,
    type: "milestone",
    customer: "Patricia López",
    description: "Alcanzó 1,000 puntos totales",
    time: "Hace 1 hora",
    icon: TrendingUp,
    color: "text-chart-4",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas transacciones y eventos del programa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted ${activity.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">{activity.customer}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
