import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardService } from "@/api/business/dashboard/dashboard.service"
import type { RewardsChartData } from "@/api/business/dashboard/dashboard.types"

const dashboardService = new DashboardService()

const chartConfig = {
  canjes: {
    label: "Canjes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function RewardsChart() {
  const [chartData, setChartData] = useState<RewardsChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardService.getRewardsChart()
        setChartData(response.data)
      } catch (error) {
        console.error("Error loading rewards chart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recompensas Populares</CardTitle>
          <CardDescription>Las recompensas más canjeadas este mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Cargando...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recompensas Populares</CardTitle>
        <CardDescription>Las recompensas más canjeadas este mes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="recompensa"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="canjes" fill="var(--color-canjes)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
