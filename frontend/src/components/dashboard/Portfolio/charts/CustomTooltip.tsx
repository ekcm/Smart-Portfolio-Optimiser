import { TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

export default function CustomTooltip ({ active, payload }: TooltipProps<ValueType, NameType>) {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${payload[0].name} : ${payload[0].value}%`}</p>
            </div>
        );
    }
    return null;
};