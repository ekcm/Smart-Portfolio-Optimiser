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

interface IndustryChartProps {
    data: { [key: string]: number | undefined }[];
}

const COLOR_COUNT = 5;

export default function IndustryChart({ data }: IndustryChartProps) {
    const chartData = data.map((item, index) => {
        const [key, value] = Object.entries(item)[0];
        return {
            industry: key.toLowerCase(),
            industryValue: value,
            fill: `hsl(var(--chart-${(index % COLOR_COUNT) + 1}))`,
        };
    });

    const chartConfig = chartData.reduce((config, item, index) => {
        config[item.industry] = {
            label: item.industry.charAt(0).toUpperCase() + item.industry.slice(1),
            color: `hsl(var(--chart-${(index % COLOR_COUNT) + 1}))`,
        };
        return config;
    }, { industry: { label: "Industry" } } as ChartConfig);

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto w-full max-h-[400px] aspect-square pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
            <PieChart>
                <ChartTooltip content={<CustomTooltip />} />
                <Pie 
                    data={chartData} 
                    dataKey="industryValue" 
                    labelLine={false}
                    label={CustomLabel} 
                    nameKey="industry"
                    outerRadius={120}
                />
                <ChartLegend
                    content={<ChartLegendContent nameKey="industry" />}
                    className="-translate-y-2 flex-wrap gap-y-0 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
        </ChartContainer>
    );
}