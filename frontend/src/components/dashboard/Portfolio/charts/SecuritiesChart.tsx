"use client";

import { Pie, PieChart, TooltipProps, PieLabelRenderProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
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
            className="mx-auto w-full aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
            <PieChart>
                <ChartTooltip content={<CustomTooltip />} />
                <Pie
                    data={chartData}
                    dataKey="securities"
                    labelLine={false}
                    label={CustomLabel}
                    nameKey="securityType"
                />
                <ChartLegend
                    content={<ChartLegendContent nameKey="securityType" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
        </ChartContainer>
    );
}