import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const topCustomers = [
  {
    id: 1,
    name: "Roberto Sánchez",
    initials: "RS",
    points: 2450,
    visits: 28,
    badge: "VIP",
  },
  {
    id: 2,
    name: "Laura Jiménez",
    initials: "LJ",
    points: 2180,
    visits: 24,
    badge: "VIP",
  },
  {
    id: 3,
    name: "Miguel Torres",
    initials: "MT",
    points: 1890,
    visits: 21,
    badge: "Gold",
  },
  {
    id: 4,
    name: "Carmen Díaz",
    initials: "CD",
    points: 1650,
    visits: 19,
    badge: "Gold",
  },
  {
    id: 5,
    name: "José Ramírez",
    initials: "JR",
    points: 1420,
    visits: 16,
    badge: "Silver",
  },
]

export function TopCustomers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mejores Clientes</CardTitle>
        <CardDescription>Clientes con más puntos acumulados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer, index) => (
            <div key={customer.id} className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                {index + 1}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {customer.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none text-foreground">{customer.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {customer.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {customer.points.toLocaleString()} pts • {customer.visits} visitas
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
