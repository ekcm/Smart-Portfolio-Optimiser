import { PieLabelRenderProps } from "recharts";

export default function OptimiserCustomLabel(props: PieLabelRenderProps) {
    const { x, y, name, value, cx, cy } = props;

    // Cast x, y, cx, and cy to numbers to avoid type issues
    const xPos = Number(x);
    const yPos = Number(y);
    const centerX = Number(cx);
    const centerY = Number(cy);

    // Calculate the offset to move the label slightly away from the chart
    const offsetX = xPos > centerX ? 10 : -10; // Adjust this value as needed
    const offsetY = yPos > centerY ? 10 : -10; // Adjust this value as needed

    // Capitalize the first letter of the name
    const capitalized_name = name.charAt(0).toUpperCase() + name.slice(1);

    return (
        <text 
            x={xPos + offsetX} 
            y={yPos + offsetY} 
            fill="black" 
            textAnchor="middle" 
            dominantBaseline="central"
            fontSize={10}
        >
            {`${capitalized_name}: ${value}%`}
        </text>
    );
}