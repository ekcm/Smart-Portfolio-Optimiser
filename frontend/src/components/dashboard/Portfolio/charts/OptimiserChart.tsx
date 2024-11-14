"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import CustomTooltip from "./CustomTooltip";
import CustomLabel from "./CustomLabel";

const chartConfig = {
    securities: {
        label: "Securities",
    },
    stock: {
        label: "Stocks",
        color: "hsl(var(--chart-1))",
    },
    bond: {
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
        className="mx-auto aspect-square max-h-[350px]"
      >
        <PieChart>
          <ChartTooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            dataKey="securities"
            labelLine={false}
            label={CustomLabel}
            nameKey="securityType"
            innerRadius={80}
          />
          <ChartLegend
                content={<ChartLegendContent nameKey="securityType" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
