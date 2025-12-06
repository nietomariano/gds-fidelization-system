"use client"

import { useState } from "react"
import { RewardCard } from "./reward-card"
import { RedeemDialog } from "./redeem-dialog"
import type { Reward, Business, LoyaltyConfig } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface BusinessRewardsTabProps {
  rewards: Reward[]
  currentPoints: number
  business: Business
  loyaltyConfig?: LoyaltyConfig
}

export function BusinessRewardsTab({ rewards, currentPoints, business, loyaltyConfig }: BusinessRewardsTabProps) {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward)
    setIsDialogOpen(true)
  }

  const handleConfirmRedeem = () => {
    // Here you would make the API call to redeem
    console.log("[v0] Redeeming reward:", selectedReward)
    setIsDialogOpen(false)
    // Show success message, update points, etc.
  }

  if (rewards.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="mb-4 size-16 text-muted-foreground" />
          <CardTitle className="mb-2">No hay recompensas disponibles</CardTitle>
          <CardDescription>Este comercio aún no ha agregado recompensas</CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Recompensas</CardTitle>
          <CardDescription>Canjea tus puntos por estas recompensas en {business.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} currentPoints={currentPoints} onRedeem={handleRedeemClick} />
            ))}
          </div>
        </CardContent>
      </Card>

      <RedeemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reward={selectedReward}
        business={business}
        currentPoints={currentPoints}
        onConfirm={handleConfirmRedeem}
        expirationEnabled={loyaltyConfig?.expirationEnabled}
        expirationDays={loyaltyConfig?.expirationDays}
      />
    </div>
  )
}
