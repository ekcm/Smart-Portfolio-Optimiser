import { Badge } from "../ui/badge";

type CustomBadgeProps = {
  amount: number; // Expecting a number from 1 to 5
};

export default function SentimentRatingCustomBadge({ amount }: CustomBadgeProps) {
    const badgeClasses = "variant='outline' h-6 flex items-center justify-center px-2 py-1 text-md text-white";

    let colorClass = "";
    if (amount === 5) {
        colorClass = "bg-green-600";
    } else if (amount >= 3 && amount <= 4) {
        colorClass = "bg-orange-400";
    } else if (amount <= 2) {
        colorClass = "bg-red-600";
    } else {
        colorClass = "bg-gray-500"; // Fallback for invalid numbers
    }

    return (
        <Badge className={`${badgeClasses} ${colorClass}`}>
            Sentiment Rating: {amount}
        </Badge>
    );
}