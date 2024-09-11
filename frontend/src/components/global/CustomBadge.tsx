import { Badge } from "../ui/badge";

type CustomBadgeProps = {
  amount: number;
};

export default function CustomBadge({ amount }: CustomBadgeProps) {
    var formattedAmount = "";
    if (amount) {
        formattedAmount = amount.toFixed(2).toString();
    } else {
        formattedAmount = "-"
    }
    const badgeClasses =
        "variant='outline' w-24 h-8 flex items-center justify-center px-2 py-1 text-md text-white";

    if (amount > 0) {
        return (
            <Badge className={`${badgeClasses} bg-green-600`}>
                +{formattedAmount.toString()}%
            </Badge>
        );
    } else if (amount < 0) {
        return (
            <Badge className={`${badgeClasses} bg-red-600`}>
                {formattedAmount.toString()}%
            </Badge>
        );
    } else {
        return (
            <Badge className={`${badgeClasses} bg-gray-500`}>
                {formattedAmount.toString()}%
            </Badge>
        );
    }
}