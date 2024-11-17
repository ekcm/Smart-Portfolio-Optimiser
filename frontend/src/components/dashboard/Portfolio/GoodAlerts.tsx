import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/lib/types";
import SentimentRatingCustomBadge from "@/components/financenews/SentimentRatingCustomBadge";

interface GoodAlertsProps {
  type: "dashboard" | "orderForm";
  data: Alert[];
}

const GoodAlerts = memo(function GoodAlerts({ type, data }: GoodAlertsProps) {
  if (data.length === 0) {
    if (type === "dashboard") {
      return <></>;
    } else if (type === "orderForm") {
      return (
        <Card className="flex flex-col flex-grow w-full py-4 px-4 bg-red-100 gap-2">
          <h2 className="text-xl font-medium">Breached Rules Alerts:</h2>
          <h3 className="text-md text-gray-600">No alerts triggered</h3>
        </Card>
      );
    }
  }
  const goodAlerts = data.filter(
    (item) => item.sentimentRating === 4 || item.sentimentRating === 5
  );

  return (
    <Card className="flex flex-col flex-grow w-full pt-4 pb-2 px-4 shadow-none border-0 border-t-4 border-blue-300 bg-blue-50 rounded-none gap-4 mt-10">
      <div>
        <h2 className="text-xl font-medium">Relevant News:</h2>
        <hr className="col-span-2 border-t border-gray-300 w-full mt-4" />
        {goodAlerts.length === 0 ? (
          <h3 className="text-md">
            No ticker alerts with low sentiment ratings!
          </h3>
        ) : (
          <ul className="list-disc mt-2">
            {goodAlerts
              .sort((a, b) => b.sentimentRating - a.sentimentRating)
              .map((item, index) => (
                <li
                  className="text-black"
                  key={index}
                  style={{ listStyleType: "none" }}
                >
                  <a href={`/financenews/${item.id}`}>
                    <div className="grid grid-cols-[1fr_auto] items-center px-2 py-2 gap-4 hover:bg-blue-100 transition-colors p-1 rounded-md">
                      <span className="hover:underline">
                        {item.assetName} ({item.ticker})
                      </span>
                      <SentimentRatingCustomBadge
                        amount={item.sentimentRating}
                      />
                    </div>
                  </a>
                </li>
              ))}
          </ul>
        )}
      </div>
    </Card>
  );
});

export default GoodAlerts;
