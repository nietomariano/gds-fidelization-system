"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowRight, Coins, Gift } from "lucide-react"
import type { Reward, Business } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RedeemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reward: Reward | null
  business: Business | null
  currentPoints: number
  onConfirm: () => void
  expirationEnabled?: boolean
  expirationDays?: number
}

export function RedeemDialog({
  open,
  onOpenChange,
  reward,
  business,
  currentPoints,
  onConfirm,
  expirationEnabled,
  expirationDays,
}: RedeemDialogProps) {
  if (!reward || !business) return null

  const pointsAfterRedeem = currentPoints - reward.cost

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="size-5 text-primary" />
            Confirmar Canje
          </DialogTitle>
          <DialogDescription>Estás a punto de canjear una recompensa</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h4 className="mb-2 font-semibold">{reward.name}</h4>
            {reward.description && <p className="text-sm text-muted-foreground">{reward.description}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Comercio</span>
              <span className="font-medium">{business.name}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Costo</span>
              <span className="flex items-center gap-1 font-medium text-primary">
                <Coins className="size-4" />
                {reward.cost} puntos
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Saldo actual</span>
              <span className="font-medium">{currentPoints} puntos</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3 text-sm">
              <span className="font-medium">Saldo después del canje</span>
              <span className="text-lg font-bold text-primary">{pointsAfterRedeem} puntos</span>
            </div>
          </div>

          {expirationEnabled && expirationDays && (
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription className="text-xs">
                Los puntos en este comercio expiran después de {expirationDays} días sin actividad
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Confirmar Canje</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
