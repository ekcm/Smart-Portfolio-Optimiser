"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { useTransitionRouter } from "next-view-transitions";

// Define types for the errors
type ErrorState = {
  clientName?: string;
  portfolioName?: string;
  riskAppetite?: string;
  cash?: string;
};

export default function CreatePortfolioForm() {
  const router = useTransitionRouter();

  // State management for each input field
  const [clientName, setClientName] = useState("");
  const [portfolioName, setPortfolioName] = useState("");
  const [riskAppetite, setRiskAppetite] = useState("");
  const [cash, setCash] = useState(0);
  const [errors, setErrors] = useState<ErrorState>({});

  // Handle form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic
    const newErrors: ErrorState = {};
    if (!clientName) newErrors.clientName = "Client name is required.";
    if (portfolioName.length < 2)
      newErrors.portfolioName = "Portfolio name must be at least 2 characters.";
    if (!riskAppetite) newErrors.riskAppetite = "Select a valid risk appetite.";
    if (cash === 0) newErrors.cash = "Cash amount must be at least 0";
    // Set errors if any are found
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    // Prepare form data
    const formData = {
      clientName,
      portfolioName,
      riskAppetite,
      cash,
    };

    console.log("Form data submitted:", formData);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-col w-1/2 gap-4">
        {/* Client Name */}
        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
          Client Name:
          <Input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={errors.clientName ? "border-red-500" : ""}
          />
          {errors.clientName && (
            <span className="text-red-500">{errors.clientName}</span>
          )}
        </Label>

        {/* Portfolio Name */}
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

        {/* Risk Appetite */}
        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
          Client Risk Appetite:
          <Select value={riskAppetite} onValueChange={setRiskAppetite}>
            <SelectTrigger>
              <SelectValue placeholder="Select risk appetite" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {["Low", "Medium", "High"].map((risk, index) => (
                  <SelectItem key={index} value={risk}>
                    {risk}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.riskAppetite && (
            <span className="text-red-500">{errors.riskAppetite}</span>
          )}
        </Label>

        {/* Cash Amount */}
        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
          Portfolio Cash Amount:
          <Input
            type="number"
            value={cash}
            onChange={(e) => setCash(parseFloat(e.target.value))}
          />
        </Label>
      </div>

      {/* Buttons */}
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