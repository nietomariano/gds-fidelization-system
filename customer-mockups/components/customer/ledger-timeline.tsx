import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, AlertCircle } from "lucide-react"
import type { PointsLedger } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface LedgerTimelineProps {
  entries: PointsLedger[]
  title?: string
}

export function LedgerTimeline({ entries, title = "Historial de Puntos" }: LedgerTimelineProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="mb-2 size-12 text-muted-foreground" />
          <p className="text-muted-foreground">No hay movimientos registrados</p>
        </CardContent>
      </Card>
    )
  }

  const sortedEntries = [...entries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Movimientos de puntos ordenados por fecha</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedEntries.map((entry) => {
            const isPositive = entry.points_change > 0
            const Icon = isPositive ? ArrowUp : ArrowDown

            return (
              <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div
                  className={`flex size-10 items-center justify-center rounded-full ${
                    isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{entry.reason || entry.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: es })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {isPositive ? "+" : ""}
                        {entry.points_change}
                      </p>
                      <Badge variant={isPositive ? "default" : "secondary"} className="text-xs">
                        {entry.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
