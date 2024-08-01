import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useDashboardFilterStore } from "../../../store/DashBoardFilterState";

export default function Filter() {
    const portfolioName = useDashboardFilterStore((state) => state.portfolioName);
    const riskAppetite = useDashboardFilterStore((state) => state.riskAppetite);
    const triggeredAlerts = useDashboardFilterStore((state) => state.triggeredAlerts);
    const setPortfolioName = useDashboardFilterStore((state) => state.setPortfolioName);
    const setRiskAppetite = useDashboardFilterStore((state) => state.setRiskAppetite);
    const setTriggeredAlerts = useDashboardFilterStore((state) => state.setTriggeredAlerts);

    const riskAppetiteLevels = ["No Filter", "Low", "Medium", "High"];

    return (
        <div className="flex items-center justify-center">
            <div className="flex w-full space-x-4">
                <Label className="flex flex-1 flex-grow-0 basis-3/5 items-center space-x-2 whitespace-nowrap text-md gap-1">
                    Portfolio Name:
                    <Input
                        type="text"
                        value={portfolioName}
                        onChange={(e) => setPortfolioName(e.target.value)}
                        className="flex-grow"
                    />
                </Label>
                <Label className="flex flex-1 flex-grow-0 basis-2/5 items-center space-x-2 whitespace-nowrap text-md gap-2">
                    Risk Appetite:
                    <Select value={riskAppetite} onValueChange={setRiskAppetite}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select risk appetite level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {riskAppetiteLevels.map((level, index) => (
                                    <SelectItem key={index} value={level}>{level}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Label>
                <Label className="flex flex-1 flex-grow-0 basis-auto items-center space-x-2 whitespace-nowrap text-md gap-2">
                    Triggered Alerts:
                    <Checkbox 
                        checked={triggeredAlerts}
                        onCheckedChange={(checked) => setTriggeredAlerts(checked as boolean)}
                        className="w-5 h-5"
                    />
                </Label>
            </div>
        </div>
    )
}