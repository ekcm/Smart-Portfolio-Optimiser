import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PortfolioBreakdown } from "@/lib/types";
import IndustryChart from "./charts/IndustryChart";
import SecuritiesChart from "./charts/SecuritiesChart";
import GeographyChart from "./charts/GeographyChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface PortfolioBreakdownCardProps {
  data: PortfolioBreakdown;
}

export default function PortfolioBreakdownCard({
  data,
}: PortfolioBreakdownCardProps) {
  const [selectedSector, setSelectedSector] = useState<string>("industry");

  const renderChart = () => {
    switch (selectedSector) {
      case "industry":
        return <IndustryChart data={data.industry} />;
      case "geography":
        return <GeographyChart data={data.geography} />;
      case "securities":
        return <SecuritiesChart data={data.securities} />;
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col w-full gap-4 border-none shadow-none mt-10">
      <h2 className="text-xl font-medium">Portfolio Breakdown</h2>
      <hr className="col-span-2 border-t border-gray-300 w-11/12" />
      <div className="flex flex-col gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-left px-4 py-2 w-48 shadow-sm border border-gray-200"
            >
              <span>
                {selectedSector === "industry" && "Industrial Sector"}
                {selectedSector === "geography" && "Geographical Sector"}
                {selectedSector === "securities" && "Securities Type"}
              </span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedSector("industry")}>
              Industrial Sector
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedSector("geography")}>
              Geographical Sector
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedSector("securities")}>
              Securities Type
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {renderChart()}
      </div>
    </Card>
  );
}
