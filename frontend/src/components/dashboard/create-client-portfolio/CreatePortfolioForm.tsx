"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useTransitionRouter } from "next-view-transitions";
import { Asset } from "@/lib/types";
import { fetchAllAssets } from "@/api/asset";
import MenuLoader from "@/components/loader/MenuLoader";

type ErrorState = {
  clientName?: string;
  portfolioName?: string;
  riskAppetite?: string;
  cashAmount?: string;
};

export default function CreatePortfolioForm() {
  const router = useTransitionRouter();
  const [client, setClient] = useState("");
  const [portfolioName, setPortfolioName] = useState("");
  const [riskAppetite, setRiskAppetite] = useState("");
  const [cashAmount, setCashAmount] = useState(0);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [errors, setErrors] = useState<ErrorState>({});
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [allAssets, setAllAssets] = useState<Asset[] | undefined>([]);
  const [assetError, setAssetError] = useState<string | null>(null);

  // risk appetite levels
  const riskAppetites = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  };


  useEffect(() => {
    getAllAssets();
  }, []);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: ErrorState = {};
    if (!client) newErrors.clientName = "Client name is required.";
    if (portfolioName.length < 2)
      newErrors.portfolioName = "Portfolio name must be at least 2 characters.";
    if (!riskAppetite) newErrors.riskAppetite = "Select a valid risk appetite.";
    if (cashAmount === 0) newErrors.cashAmount = "Cash amount must be at least 0";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const formData = {
      client,
      portfolioName,
      riskAppetite,
      cashAmount,
      exclusions,
      manager: "66d9815bacb3da812c4e4c5b",
      assetHoldings: [],
    };

    console.log("Form data submitted:", formData);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-col w-1/2 gap-4">
        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
          Client Name:
          <Input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className={errors.clientName ? "border-red-500" : ""}
          />
          {errors.clientName && (
            <span className="text-red-500">{errors.clientName}</span>
          )}
        </Label>

        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
          Portfolio Name:
          <Input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className={errors.portfolioName ? "border-red-500" : ""}
          />
          {errors.portfolioName && (
            <span className="text-red-500">{errors.portfolioName}</span>
          )}
        </Label>

        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
          Client Risk Appetite:
          <Select value={riskAppetite} onValueChange={setRiskAppetite}>
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

        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
          Portfolio Cash Amount:
          <Input
            type="number"
            value={cashAmount}
            onChange={(e) => setCashAmount(parseFloat(e.target.value))}
          />
        </Label>

        {/* Exclusions using Select */}
        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
          Exclusions List:
          <Select onValueChange={handleAddExclusion}>
            <SelectTrigger>
              <SelectValue placeholder="Select assets to exclude" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {assetsLoading ? (
                  <MenuLoader />
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
      </div>

      <div className="flex gap-2 mt-4">
        <Button type="submit" className="bg-red-500">
          Create Portfolio
        </Button>
        <Button
          type="button"
          className="bg-gray-400 text-white"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}