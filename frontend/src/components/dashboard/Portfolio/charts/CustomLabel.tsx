import { PieLabelRenderProps } from "recharts";

export default function CustomLabel(props: PieLabelRenderProps) {
    const { x, y, value } = props;
    return (
        <text
            x={x}
            y={y}
            fill="black"
            textAnchor="middle"
            dominantBaseline="central"
        >
            {value >= 5 ? `${value.toFixed(2)}%` : ''}
        </text>
    );
};