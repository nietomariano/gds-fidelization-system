import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardService } from "@/api/business/dashboard/dashboard.service"
import type { PointsChartData } from "@/api/business/dashboard/dashboard.types"

const dashboardService = new DashboardService()

const chartConfig = {
  puntos: {
    label: "Puntos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function PointsChart() {
  const [chartData, setChartData] = useState<PointsChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardService.getPointsChart()
        setChartData(response.data)
      } catch (error) {
        console.error("Error loading points chart:", error)
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
          <CardTitle>Puntos Otorgados</CardTitle>
          <CardDescription>Tendencia de puntos otorgados en el último mes</CardDescription>
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
        <CardTitle>Puntos Otorgados</CardTitle>
        <CardDescription>Tendencia de puntos otorgados en el último mes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillPuntos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-puntos)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-puntos)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="puntos"
              type="monotone"
              fill="url(#fillPuntos)"
              fillOpacity={0.4}
              stroke="var(--color-puntos)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
