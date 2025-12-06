"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Coins } from "lucide-react"
import type { Reward } from "@/lib/types"

interface RewardCardProps {
  reward: Reward
  currentPoints: number
  onRedeem?: (reward: Reward) => void
}

export function RewardCard({ reward, currentPoints, onRedeem }: RewardCardProps) {
  const canRedeem = currentPoints >= reward.cost

  return (
    <Card className={`transition-all ${canRedeem ? "border-primary/50 hover:shadow-md" : "opacity-75"}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Gift className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{reward.name}</CardTitle>
              {reward.description && <CardDescription className="text-sm">{reward.description}</CardDescription>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-primary" />
            <span className="text-lg font-bold text-primary">{reward.cost} puntos</span>
          </div>
          <Button size="sm" disabled={!canRedeem} onClick={() => onRedeem?.(reward)}>
            {canRedeem ? "Canjear" : "Insuficiente"}
          </Button>
        </div>
        {!canRedeem && (
          <p className="mt-2 text-xs text-muted-foreground">
            Te faltan {reward.cost - currentPoints} puntos para este canje
          </p>
        )}
      </CardContent>
    </Card>
  )
}
