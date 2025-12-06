import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react"
import type { Business } from "@/lib/types"
import Link from "next/link"

interface BusinessCardProps {
  business: Business
  points?: number
  showPoints?: boolean
  showActions?: boolean
}

export function BusinessCard({ business, points, showPoints = false, showActions = true }: BusinessCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <img
            src={business.profilePicture || "/placeholder.svg?height=80&width=80"}
            alt={business.name}
            className="size-20 rounded-lg object-cover"
          />
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{business.name}</h3>
                {showPoints && points !== undefined && (
                  <Badge variant="default" className="bg-primary">
                    {points} puntos
                  </Badge>
                )}
              </div>
              {showActions && (
                <Button size="sm" asChild>
                  <Link href={`/dashboard/businesses/${business.id}`}>Ver Detalles</Link>
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {business.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {business.address}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {business.instagramUrl && (
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <Instagram className="size-4" />
                </a>
              )}
              {business.facebookUrl && (
                <a
                  href={business.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <Facebook className="size-4" />
                </a>
              )}
              {business.phoneNumber && (
                <a
                  href={`tel:${business.phoneNumber}`}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="size-4" />
                </a>
              )}
              {business.email && (
                <a
                  href={`mailto:${business.email}`}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
