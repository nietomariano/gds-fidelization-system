import { Card, CardContent } from "@/components/ui/card"
import { Coins } from "lucide-react"

interface PointsBadgeProps {
  points: number
  businessName?: string
  size?: "sm" | "md" | "lg"
}

export function PointsBadge({ points, businessName, size = "md" }: PointsBadgeProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Coins className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{businessName ? `Puntos en ${businessName}` : "Puntos"}</p>
            <p className={`font-bold text-primary ${sizeClasses[size]}`}>{points.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
