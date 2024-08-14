import { Badge } from "../ui/badge";

type CustomBadgeProps = {
  orderType: string;
};

export default function OrderTypeBadge({ orderType }: CustomBadgeProps) {
    const badgeClasses =
        "variant='outline' w-24 h-8 flex items-center justify-center px-2 py-1 text-md text-white";

    if (orderType === "Buy") {
        return (
            <Badge className={`${badgeClasses} bg-green-700`}>
                Buy
            </Badge>
        );
    } else {
        return (
            <Badge className={`${badgeClasses} bg-red-600`}>
                Sell
            </Badge>
        );
    }
}