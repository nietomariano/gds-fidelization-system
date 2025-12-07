"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { date: "1 Ene", puntos: 2400 },
  { date: "5 Ene", puntos: 2800 },
  { date: "10 Ene", puntos: 3200 },
  { date: "15 Ene", puntos: 2900 },
  { date: "20 Ene", puntos: 3800 },
  { date: "25 Ene", puntos: 4200 },
  { date: "30 Ene", puntos: 4600 },
]

const chartConfig = {
  puntos: {
    label: "Puntos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function PointsChart() {
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
