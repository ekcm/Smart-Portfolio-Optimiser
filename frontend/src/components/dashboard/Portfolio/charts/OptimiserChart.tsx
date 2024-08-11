"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import CustomTooltip from "./CustomTooltip";
import CustomLabel from "./CustomLabel";
import OptimiserCustomLabel from "./OptimiserCustomLabel";

const chartConfig = {
    securities: {
        label: "Securities",
    },
    equity: {
        label: "Equity",
        color: "hsl(var(--chart-1))",
    },
    bonds: {
        label: "Bonds",
        color: "hsl(var(--chart-2))",
    },
    cash: {
        label: "Cash",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

interface OptimiserChartProps {
    data: { [key: string]: number | undefined }[];
}

export default function OptimiserChart({ data } : OptimiserChartProps) {
  const chartData = data.map(item => {
    const [key, value] = Object.entries(item)[0];
    return {
        securityType: key.toLowerCase(),
        securities: value,
        fill: `var(--color-${key.toLowerCase()})`,
    };
  });

  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[400px]"
      >
        <PieChart>
          <ChartTooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            dataKey="securities"
            labelLine={false}
            label={OptimiserCustomLabel}
            nameKey="securityType"
            innerRadius={80}
          />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
