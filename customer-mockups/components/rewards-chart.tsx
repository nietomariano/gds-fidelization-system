"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { recompensa: "Descuento 10%", canjes: 89 },
  { recompensa: "Café Gratis", canjes: 72 },
  { recompensa: "Producto 2x1", canjes: 65 },
  { recompensa: "Descuento 20%", canjes: 54 },
  { recompensa: "Envío Gratis", canjes: 48 },
]

const chartConfig = {
  canjes: {
    label: "Canjes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function RewardsChart() {
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
