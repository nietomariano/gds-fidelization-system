import { DashboardHeader } from "@/components/dashboard-header.tsx"
import { StatsCards } from "@/components/stats-cards.tsx"
import { PointsChart } from "@/components/points-chart.tsx"
import { RewardsChart } from "@/components/rewards-chart.tsx"
import { RecentActivity } from "@/components/recent-activity.tsx"
import { TopCustomers } from "@/components/top-customers.tsx"

export default function DashboardPage() {
  return (
    <div className="bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-2">
          <PointsChart />
          <RewardsChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <TopCustomers />
        </div>
      </main>
    </div>
  )
}
