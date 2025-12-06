import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { PointsChart } from "@/components/points-chart"
import { RewardsChart } from "@/components/rewards-chart"
import { RecentActivity } from "@/components/recent-activity"
import { TopCustomers } from "@/components/top-customers"

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
