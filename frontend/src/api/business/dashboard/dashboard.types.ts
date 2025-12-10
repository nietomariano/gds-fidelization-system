// Dashboard statistics types
export interface DashboardStats {
  activeCustomers: number
  activeCustomersChange: number
  pointsAwarded: number
  pointsAwardedChange: number
  rewardsRedeemed: number
  rewardsRedeemedChange: number
  retentionRate: number
}

export type GetDashboardStatsResponse = DashboardStats

// Points chart types
export interface PointsChartData {
  date: string
  puntos: number
}

export type GetPointsChartResponse = PointsChartData[]

// Rewards chart types
export interface RewardsChartData {
  recompensa: string
  canjes: number
}

export type GetRewardsChartResponse = RewardsChartData[]

// Recent activity types
export interface RecentActivity {
  type: 'venta' | 'canje' | 'cliente'
  title: string
  description: string
  time: string
  badge: string
}

export type GetRecentActivityResponse = RecentActivity[]

// Top customers types
export interface TopCustomer {
  rank: number
  name: string
  initials: string
  points: number
  visits: number
  tier: 'Gold' | 'Silver' | 'Bronze'
}

export type GetTopCustomersResponse = TopCustomer[]
