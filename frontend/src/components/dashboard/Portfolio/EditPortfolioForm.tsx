"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { useTransitionRouter } from 'next-view-transitions';
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";
import { updatePortfolioRule, viewBasicPortfolio } from "@/api/portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { fetchAllAssets } from "@/api/asset";
import { Asset, RuleType } from "@/lib/types";
import { riskAppetites, ruleTypes } from "@/utils/constants";

type ErrorState = {
    riskAppetite?: string;
    reason?: string;
    minCash?: string;
    maxCash?: string;
};

interface EditPortfolioFormProps {
    portfolioId: string;
}

export default function EditPortfolioForm({ portfolioId} : EditPortfolioFormProps) {
    const router = useTransitionRouter();
    const { toast } = useToast();

    // old rules
    const [oldMinCash, setOldMinCash] = useState<number>(0);
    const [oldMaxCash, setOldMaxCash] = useState<number>(0);

    // form states
    const [selectedRule, setSelectedRule] = useState<string>("");
    const [editPortfolioState, setEditPortfolioState] = useState<boolean>(false);
    const [riskAppetite, setRiskAppetite] = useState("");
    const [minCash, setMinCash] = useState<number>(0);
    const [maxCash, setMaxCash] = useState<number>(20);
    const [exclusions, setExclusions] = useState<string[]>([]);
    const [allAssets, setAllAssets] = useState<Asset[] | undefined>([]);
    const [reason, setReason] = useState<string>("");
    const [errors, setErrors] = useState<ErrorState>({});
    const [loadPortfolioError, setLoadPortfolioError] = useState<string | null>(null);

    // loaders
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [assetsLoading, setAssetsLoading] = useState<boolean>(true);
    const [assetError, setAssetError] = useState<string | null>(null);

    useEffect(() => {
        if (portfolioId) {
            getPortfolioRules(portfolioId);
            getAllAssets();
        }
    }, [portfolioId]);

    const getPortfolioRules = async (portfolioId : string) => {
        try {
            const portfolioData = await viewBasicPortfolio(portfolioId);
            setOldMinCash(portfolioData.rules.minCashRule.percentage);
            setOldMaxCash(portfolioData.rules.maxCashRule.percentage);
            setMinCash(portfolioData.rules.minCashRule.percentage);
            setMaxCash(portfolioData.rules.maxCashRule.percentage);
            setRiskAppetite(portfolioData.riskAppetite);
            setExclusions(portfolioData.exclusions[0].split(","));
        } catch (error) {
            console.error("Error fetching portfolio data: ", error);
            setLoadPortfolioError("Failed to fetch portfolio data");
        } finally {
            setIsLoading(false);
        }
    }

    const getAllAssets = async () => {
        try {
        const data = await fetchAllAssets();
        setAllAssets(data);
        } catch (error) {
        console.error("Error fetching assets: ", error);
        setAssetError("Failed to load assets");
        } finally {
        setAssetsLoading(false);
        }
    };

    const handleRuleSelect = (selectedValue: RuleType) => {
        setSelectedRule(selectedValue);
    };

    const handleAddExclusion = (value: string) => {
        if (!exclusions.includes(value)) {
        setExclusions([...exclusions, value]);
        }
    };

    const handleRemoveExclusion = (index: number) => {
        setExclusions(exclusions.filter((_, i) => i !== index));
    };

    const handleResetExclusions = () => {
        setExclusions([]); // Reset the exclusions array
    };

    const onSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: ErrorState = {};
        // validation
        if (minCash >= maxCash) {
            newErrors.maxCash = "Maximum cash (%) cannot be less than minimum cash (%)!";
            newErrors.minCash = "Maximum cash (%) cannot be less than minimum cash (%)!";
        }
        if (!reason) newErrors.reason = "No reason stated.";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        let ruleValue;
        if (selectedRule === RuleType.RISK) {
            ruleValue = riskAppetite;
        } else if (selectedRule === RuleType.MIN_CASH) {
            ruleValue = minCash;
        } else if (selectedRule === RuleType.MAX_CASH) {
            ruleValue = maxCash;
        } else if (selectedRule === RuleType.EXCLUSIONS) {
            ruleValue = exclusions.join(",");
        }
        setErrors({});
        setIsUpdateLoading(true);
        setEditPortfolioState(true);
        try {
            const result = await updatePortfolioRule(portfolioId, ruleValue, selectedRule as RuleType, reason);
            toast({
                title: `Portfolio Rule ${selectedRule} has been updated`,
                description: `Portfolio rule has been updated successfully, you can update other rules or move back to the dashboard!`,
            });
        } catch (error) {
            console.error("Error updating portolio rule: ", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with your request: ${error}`,
            });
        } finally {
            console.log("Rules updated:", portfolioId);
            setIsUpdateLoading(false);
            setEditPortfolioState(false);
            getPortfolioRules(portfolioId);
        }
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
                    Rules:
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
                                <span className="text-red-500 italic font-normal">Current Min: {oldMinCash}</span>
                            }
                        </div>
                        <Input
                            type="number"
                            disabled={editPortfolioState}
                            value={minCash}
                            onChange={(e) => {
                                // Prevent user from leaving it blank (empty string)
                                if (e.target.value === "" || isNaN(Number(e.target.value))) return;
                                setMinCash(parseFloat(e.target.value));
                            }}   
                        />
                        {errors.minCash && (
                            <span className="text-red-500">{errors.minCash}</span>
                        )}
                    </Label>
                )}
                {selectedRule === RuleType.MAX_CASH && (
                    <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                        <div className="flex justify-between">
                            <span>Maximum Cash Amount (%): </span>
                            {isLoading ? 
                                <Skeleton className="w-[100px] h-[25px] rounded-full" />
                                : 
                                <span className="text-red-500 italic font-normal text-sm">Current Max: {oldMaxCash}</span>
                            }
                        </div>
                        <Input
                            type="number"
                            disabled={editPortfolioState}
                            value={maxCash}
                            onChange={(e) => {
                                // Prevent user from leaving it blank (empty string)
                                if (e.target.value === "" || isNaN(Number(e.target.value))) return;
                                setMaxCash(parseFloat(e.target.value));
                            }}
                        />
                        {errors.maxCash && (
                            <span className="text-red-500">{errors.maxCash}</span>
                        )}
                    </Label>
                )}
                {selectedRule !== "" && 
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
                }
                {selectedRule === RuleType.EXCLUSIONS && (
                    <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                        Exclusions List:
                        <Select onValueChange={handleAddExclusion} disabled={editPortfolioState}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select assets to exclude" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                {assetsLoading ? (
                                    <Loader />
                                ) : (
                                    <SelectGroup>
                                    {allAssets?.map((asset, index) => (
                                        <SelectItem key={index} value={asset.ticker}>
                                        {asset.name}
                                    </SelectItem>
                                    ))}
                                </SelectGroup>
                                )}
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                        {assetError && <span className="text-red-500">{assetError}</span>}
                        <ul className="flex flex-col list-disc list-inside gap-2">
                            {exclusions.length !==0 ?
                            <span>Your Exclusions:</span>
                            : 
                            <span>No Exclusions Selected</span>
                            }
                            {exclusions.map((exclusion, index) => (
                                <li key={index} className="flex items-center justify-between">
                                {exclusion}
                                <Button
                                type="button"
                                onClick={() => handleRemoveExclusion(index)}
                                size="sm"
                                variant="destructive"
                                >
                                Remove
                                </Button>
                            </li>
                            ))}
                        </ul>
                        {/* Reset Button */}
                        {exclusions.length > 0 && (
                            <Button
                            type="button"
                            onClick={handleResetExclusions}
                            className="mt-2"
                            >
                            Reset Exclusions
                            </Button>
                        )}
                    </Label>
                )}
            </div>
            <div className="flex gap-2 mt-4">
                <Button type="button" className="bg-gray-400 text-white" onClick={(e) => {
                    e.preventDefault()
                    router.back()
                }}>
                    Cancel
                </Button>
                {isUpdateLoading ?
                    <Button className="bg-red-500" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Portfolio Rules...
                    </Button>
                :
                    <Button type="submit" className="bg-red-500 hover:bg-red-800" disabled={selectedRule === ""}>Confirm Changes</Button>
                }
            </div>
        </form>
    );
}