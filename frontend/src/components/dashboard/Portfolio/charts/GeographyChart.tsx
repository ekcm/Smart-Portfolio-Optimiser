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

interface GeographyChartProps {
    data: { [key: string]: number | undefined }[];
}

export default function GeographyChart({ data }: GeographyChartProps) {
    const chartData = data.map((item, index) => {
        const [key, value] = Object.entries(item)[0];
        return {
            country: key.toLowerCase(),
            countryValue: value,
            fill: `hsl(var(--chart-${index + 1}))`,
        };
    });

    const chartConfig = chartData.reduce((config, item, index) => {
        config[item.country] = {
            label: item.country.charAt(0).toUpperCase() + item.country.slice(1),
            color: `hsl(var(--chart-${index + 1}))`,
        };
        return config;
    }, { country: { label: "Country" } } as ChartConfig);

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto w-full max-h-[400px] aspect-square pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
            <PieChart>
                <ChartTooltip content={<CustomTooltip />} />
                <Pie 
                    data={chartData} 
                    dataKey="countryValue" 
                    labelLine={false}
                    label={CustomLabel} 
                    nameKey="country"
                    outerRadius={120}
                />
                <ChartLegend
                    content={<ChartLegendContent nameKey="country" />}
                    className="-translate-y-2 flex-wrap gap-y-0 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
        </ChartContainer>
    );
}