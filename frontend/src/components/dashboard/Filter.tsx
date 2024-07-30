import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { useFilterStore } from "../../../store/FilterState";

export default function Filter() {
    const portfolioName = useFilterStore((state) => state.portfolioName);
    const riskAppetite = useFilterStore((state) => state.riskAppetite);
    const triggeredAlerts = useFilterStore((state) => state.triggeredAlerts);
    const setPortfolioName = useFilterStore((state) => state.setPortfolioName);
    const setRiskAppetite = useFilterStore((state) => state.setRiskAppetite);
    const setTriggeredAlerts = useFilterStore((state) => state.setTriggeredAlerts);

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