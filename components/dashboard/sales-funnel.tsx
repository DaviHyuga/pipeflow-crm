"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FunnelStageData } from "@/types/dashboard"

function formatValue(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}k`
  return `R$ ${value}`
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: FunnelStageData }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-1">{data.label}</p>
      <p className="text-muted-foreground">
        {data.count} {data.count === 1 ? "negócio" : "negócios"}
      </p>
      <p className="text-muted-foreground">{formatValue(data.value)}</p>
    </div>
  )
}

interface SalesFunnelProps {
  data: FunnelStageData[]
}

export function SalesFunnel({ data }: SalesFunnelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Negócios por Etapa</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={true}
              tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(120, 120, 140, 0.08)" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={72}>
              {data.map((entry) => (
                <Cell
                  key={entry.stageId}
                  fill={entry.color}
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
