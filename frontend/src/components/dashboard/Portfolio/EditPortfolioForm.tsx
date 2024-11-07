"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { useTransitionRouter } from 'next-view-transitions';
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";
import { viewBasicPortfolio } from "@/api/portfolio";
import { Skeleton } from "@/components/ui/skeleton";

type ErrorState = {
  clientName?: string;
  portfolioName?: string;
  riskAppetite?: string;
  cashAmount?: string;
  reason?: string;
};

interface EditPortfolioFormProps {
    portfolioId: string;
}

enum RuleType {
    MIN_CASH = 'MIN_CASH',
    MAX_CASH = 'MAX_CASH',
    RISK = 'RISK',
    EXCLUSIONS = 'EXCLUSIONS'
}

export default function EditPortfolioForm({ portfolioId} : EditPortfolioFormProps) {
    const router = useTransitionRouter();

    // form states
    const [selectedRule, setSelectedRule] = useState<string>("");
    const [editPortfolioState, setEditPortfolioState] = useState<boolean>(false);
    const [riskAppetite, setRiskAppetite] = useState("");
    const [minCash, setMinCash] = useState<number>(0);
    const [maxCash, setMaxCash] = useState<number>(20);
    const [reason, setReason] = useState<string>("");
    const [errors, setErrors] = useState<ErrorState>({});
    const [loadPortfolioError, setLoadPortfolioError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const ruleTypes = [
        { value: RuleType.MIN_CASH, label: "Minimum Cash" },
        { value: RuleType.MAX_CASH, label: "Maximum Cash" },
        { value: RuleType.RISK, label: "Risk Level" },
        // Add other RuleType mappings as needed
    ];

    const riskAppetites = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
    };

    useEffect(() => {
        if (portfolioId) {
            getPortfolioRules(portfolioId);
        }
    }, [portfolioId]);

    const getPortfolioRules = async (portfolioId : string) => {
        try {
            const portfolioData = await viewBasicPortfolio(portfolioId);
            setMinCash(portfolioData.rules.minCashRule.percentage);
            setMaxCash(portfolioData.rules.maxCashRule.percentage);
            setRiskAppetite(portfolioData.riskAppetite);
        } catch (error) {
            console.error("Error fetching portfolio data: ", error);
            setLoadPortfolioError("Failed to fetch portfolio data");
        } finally {
            setIsLoading(false);
        }
    }

    const handleRuleSelect = (selectedValue: RuleType) => {
        setSelectedRule(selectedValue);
    };

    // TODO: Add logic for adding to api params appropriate rule value to change
    // TODO: Add api call to update portfolio rules
    const onSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: ErrorState = {};
        // validation
        if (!reason) newErrors.reason = "No reason stated.";
        console.log("Form data submitted to portfolio id:", portfolioId);
        // console.log("Form data submitted:", data);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    return (
        <form onSubmit={onSubmit} onKeyDown={handleKeyDown} className="space-y-8">
            <div className="flex flex-col w-1/2 gap-4">
                <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                    Exclusions List:
                    <Select onValueChange={handleRuleSelect} disabled={editPortfolioState}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Rule to Edit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {ruleTypes.map((rule, index) => (
                                    <SelectItem key={index} value={rule.value}>
                                        {rule.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Label>
                {selectedRule === RuleType.RISK && (
                    <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                        Client Risk Appetite:
                        <Select value={riskAppetite} onValueChange={setRiskAppetite} disabled={editPortfolioState}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select risk appetite" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                {Object.entries(riskAppetites).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                    {value}
                                </SelectItem>
                                ))}
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.riskAppetite && (
                            <span className="text-red-500">{errors.riskAppetite}</span>
                        )}
                    </Label>
                )}
                {selectedRule === RuleType.MIN_CASH && (
                    <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                        <div className="flex justify-between">
                            <span>Minimum Cash Amount (%): </span>
                            {isLoading ? 
                                <Skeleton className="w-[100px] h-[25px] rounded-full" />
                            : 
                                <span className="text-red-500 italic font-normal">Current Min: {minCash}</span>
                            }
                        </div>
                        <Input
                            type="number"
                            disabled={editPortfolioState}
                            value={minCash}
                            onChange={(e) => setMinCash(parseFloat(e.target.value))}
                        />
                    </Label>
                )}
                {selectedRule === RuleType.MAX_CASH && (
                    <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                        <div className="flex justify-between">
                            <span>Maximum Cash Amount (%): </span>
                            {isLoading ? 
                                <Skeleton className="w-[100px] h-[25px] rounded-full" />
                                : 
                                <span className="text-red-500 italic font-normal">Current Max: {maxCash}</span>
                            }
                        </div>
                        <Input
                            type="number"
                            disabled={editPortfolioState}
                            value={maxCash}
                            onChange={(e) => setMaxCash(parseFloat(e.target.value))}
                        />
                    </Label>
                )}
                <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                    Reason for change:
                    <Input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={errors.reason ? "border-red-500" : ""}
                        disabled={editPortfolioState}
                    />
                    {errors.reason && (
                        <span className="text-red-500">{errors.reason}</span>
                    )}
                    </Label>
            </div>
            <div className="flex gap-2 mt-4">
                <Button type="button" className="bg-gray-400 text-white" onClick={(e) => {
                    e.preventDefault()
                    router.back()
                }}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-red-500">Confirm Changes</Button>
            </div>
        </form>
    );
}