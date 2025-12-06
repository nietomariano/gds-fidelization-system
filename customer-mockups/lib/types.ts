// Customer-facing types for the loyalty app

export type Business = {
  id: string
  name: string
  email?: string
  phoneNumber?: string
  address?: string
  profilePicture?: string
  instagramUrl?: string
  facebookUrl?: string
}

export type Reward = {
  id: string
  name: string
  cost: number
  business_id: string
  description?: string
}

export type LoyaltyConfig = {
  id: string
  business_id: string
  baseAmount: number // cada X pesos...
  pointsAwarded: number // ...da Y puntos
  welcomeEnabled: boolean
  welcomePoints?: number
  expirationEnabled: boolean
  expirationDays?: number
}

export type Customer = {
  id: string
  name: string
  email?: string
  phoneNumber?: string
  profilePic?: string
}

export type CustomerBusiness = {
  business_id: string
  customer_id: string
  cached_points: number // saldo rápido por comercio
}

export type Purchase = {
  id: string
  amount: number // decimal(10,2)
  createdAt: string // ISO
  points: number
  business_id: string
  customer_id: string
  isVoided: boolean
  paymentMethod?: string
}

export type Redeem = {
  id: string
  reward_id: string
  business_id: string
  customer_id: string
  createdAt: string
  pointsUsed: number
}

export type PointsLedger = {
  id: string
  business_id: string
  customer_id: string
  purchase_id?: string
  redeem_id?: string
  points_change: number // +acreditación / -débitos
  type: "earn" | "redeem" | "adjust" | "void"
  created_at: string
  reason?: string
}
