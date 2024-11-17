import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Alert, RuleReport } from "@/lib/types";
import SentimentRatingCustomBadge from "@/components/financenews/SentimentRatingCustomBadge";
import { ruleTypes } from "@/utils/constants";

interface TriggeredAlertProps {
  type: "dashboard" | "orderForm";
  data: Alert[];
  ruleReport: RuleReport;
}

const TriggeredAlert = memo(function TriggeredAlert({
  type,
  data,
  ruleReport,
}: TriggeredAlertProps) {
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
  const breachedAlerts = data.filter(
    (item) => item.sentimentRating === 1 || item.sentimentRating === 2
  );
  const usefulAlerts = data.filter(
    (item) => item.sentimentRating === 4 || item.sentimentRating === 5
  );

  return (
    <Card className="flex flex-col flex-grow w-full pt-4 pb-2 px-4 shadow-none rounded-lg bg-yellow-50">
      <div>
        <div className="flex items-center gap-2 text-yellow-800">
          <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <h2 className="text-xl font-medium">Breached Rules:</h2>
        </div>
        {ruleReport.breachedRules.length === 0 ? (
          <h3 className="text-md text-gray-600">No rules breached</h3>
        ) : (
          <>
            <h3 className="text-md text-gray-600">
              Portfolio rules has been breached in the following categories:
            </h3>
            <ul className="list-disc">
              {ruleReport.breachedRules.map((rule, index) => (
                <li
                  className="text-gray-600 font-medium text-sm"
                  key={index}
                  style={{ listStyleType: "none" }}
                >
                  <div className="space-x-2">
                    <span className="text-red-600">
                      {ruleTypes.find((type) => type.value === rule.ruleType)
                        ?.label || "Unknown Rule Type"}{" "}
                      Rule breached:
                    </span>
                    <span>{rule.breachMessage}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col mt-4">
              <div className="space-x-2">
                <span className="text-red-600 font-medium">
                  Recommendation:
                </span>
                <span className="font-medium">{ruleReport.recommendation}</span>
              </div>
              {ruleReport.news && (
                <div className="mt-4">
                  {ruleReport.news.buy && ruleReport.news.buy.length > 0 && (
                    <div>
                      <h3 className="text-md text-green-600 font-semibold">
                        Buy Recommendations:
                      </h3>
                      <ul className="list-disc pl-5">
                        {ruleReport.news.buy.map((newsItem, newsIndex) => (
                          <li key={newsIndex} className="text-gray-600">
                            <a href={`/financenews/${newsItem.id}`}>
                              <div className="grid grid-cols-[1fr_auto] items-center gap-4 hover:bg-amber-100 transition-colors p-1">
                                {newsItem.assetName} ({newsItem.ticker})
                                <SentimentRatingCustomBadge
                                  amount={newsItem.sentimentRating}
                                />
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {ruleReport.news.sell && ruleReport.news.sell.length > 0 && (
                    <div>
                      <h3 className="text-md text-red-600 font-semibold">
                        Sell Recommendations:
                      </h3>
                      <ul className="list-disc pl-5">
                        {ruleReport.news.sell.map((newsItem, newsIndex) => (
                          <li key={newsIndex} className="text-gray-600">
                            <a href={`/financenews/${newsItem.id}`}>
                              <div className="grid grid-cols-[1fr_auto] items-center gap-4 hover:bg-amber-100 transition-colors p-1">
                                {newsItem.assetName} ({newsItem.ticker})
                                <SentimentRatingCustomBadge
                                  amount={newsItem.sentimentRating}
                                />
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div>
        <h2 className="text-lg font-medium">Ticker Alerts:</h2>
        {breachedAlerts.length === 0 ? (
          <h3 className="text-md text-gray-600">
            No ticker alerts with low sentiment ratings!
          </h3>
        ) : (
          <ul className="list-disc">
            {breachedAlerts
              .sort((a, b) => b.sentimentRating - a.sentimentRating)
              .map((item, index) => (
                <li
                  className="text-black"
                  key={index}
                  style={{ listStyleType: "none" }}
                >
                  <a href={`/financenews/${item.id}`}>
                    <div className="grid grid-cols-[1fr_auto] items-center px-2 py-2 gap-4 hover:bg-amber-100 transition-colors p-1 rounded-md w-full">
                      <span className="underline">
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

export default TriggeredAlert;
