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
        label: "Stock",
        color: "hsl(var(--chart-2))",
    },
    bond: {
        label: "Bonds",
        color: "hsl(var(--chart-1))",
    },
    cash: {
        label: "Cash",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

interface SecuritiesChartProps {
    data: { [key: string]: number | undefined }[];
}

export default function SecuritiesChart({ data }: SecuritiesChartProps) {
    const chartData = data.map(item => {
        const [key, value] = Object.entries(item)[0];
        return {
            securityType: key.toLowerCase(),
            securities: value,
            fill: `var(--color-${key.toLowerCase()})`,
        };
    });

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto w-full max-h-[400px] aspect-square pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
            <PieChart>
                <ChartTooltip content={<CustomTooltip />} />
                <Pie
                    data={chartData}
                    dataKey="securities"
                    labelLine={false}
                    label={CustomLabel}
                    nameKey="securityType"
                    outerRadius={120}
                />
                <ChartLegend
                    content={<ChartLegendContent nameKey="securityType" />}
                    className="-translate-y-2 flex-wrap gap-y-0 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
        </ChartContainer>
    );
}