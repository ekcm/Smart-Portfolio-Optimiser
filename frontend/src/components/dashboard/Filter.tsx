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
        <div className="grid grid-cols-6 gap-6">
            <div className="col-span-3 flex items-center space-x-2">
                <Label htmlFor="portfolioName" className="whitespace-nowrap text-md">Portfolio Name:</Label>
                <Input
                    type="text"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    className="flex-grow"
                />
            </div>
            <div className="col-span-2 flex items-center space-x-2">
                <Label htmlFor="portfolioName" className="whitespace-nowrap text-md">Risk Appetite:</Label>
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
            </div>
            <div className="col-span-1 flex items-center space-x-2">
                <Label htmlFor="portfolioName" className="whitespace-nowrap text-md">Triggered Alerts:</Label>
                <Checkbox 
                    id="triggeredAlerts"
                    checked={triggeredAlerts}
                    onCheckedChange={(checked) => setTriggeredAlerts(checked as boolean)}
                    className="w-6 h-6"
                />
            </div>
        </div>
    )
}