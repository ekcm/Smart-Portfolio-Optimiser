import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Asset, PortfolioHoldings } from "@/lib/types";
import { fetchCurrentAssetPrice } from "@/api/asset";
import { delay } from "@/utils/utils";

interface AddTransactionFormProps {
    cashBalance: number;
    buyingPower: number;
    portfolioAssets: PortfolioHoldings[];
    assetsData: Asset[] | undefined;
    formData: {
        type: string;
        ticker: string;
        cost: number;
        position: number;
        orderType: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        type: string;
        ticker: string;
        cost: number;
        position: number;
        orderType: string;
    }>>;
    onSubmit: (data: {
        type: string;
        ticker: string;
        cost: number;
        position: number;
        orderType: string;
    }) => void;
    onReset: () => void;
}

export default function AddTransactionForm({ 
    cashBalance, 
    buyingPower, 
    portfolioAssets, 
    assetsData,
    formData, 
    setFormData, 
    onSubmit, 
    onReset 
}: AddTransactionFormProps) {
    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    const [buyingPowerVar, setBuyingPowerVar] = useState(buyingPower);
    const [totalCost, setTotalCost] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [showWarningPosition, setShowWarningPosition] = useState(false);
    const [maxQuantity, setMaxQuantity] = useState(0);

    useEffect(() => {
        setTotalCost(formData.cost * formData.position);
    }, [formData.cost, formData.position])

    useEffect(() => {
        if (formData.orderType === "Buy") {
            const updatedCash = buyingPower - totalCost;
            setBuyingPowerVar(updatedCash >= 0 ? updatedCash : 0);
            setShowWarning(totalCost > buyingPower);
        } else {
            setBuyingPowerVar(buyingPower);
            setShowWarning(false);
        }
        if (formData.orderType === "Sell") {
            setShowWarningPosition(formData.position === maxQuantity);
        }
    }, [totalCost, buyingPower, formData.orderType, formData.position, maxQuantity])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = Number(value); // Ensure the input value is treated as a number

        // Cap the position if the order type is "Sell"
        if (name === "position" && formData.orderType === "Sell") {
            const assetInPortfolio = portfolioAssets.find(asset => asset.ticker === formData.ticker);
            
            if (assetInPortfolio) {
                const maxQuantity = assetInPortfolio.position;

                // If user enters a quantity greater than they hold, cap it at the max they have
                setFormData((prev) => ({
                    ...prev,
                    position: numericValue > maxQuantity ? maxQuantity : numericValue,
                }));
            } else {
                // If the asset isn't found, set position to 0
                setFormData((prev) => ({
                    ...prev,
                    position: 0,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue, // Use the value for other fields without capping
            }));
        }
    };

    const handleSelectChange = async (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Fetch asset price
        if (name === "ticker") {
            await getAssetPrice(value);
        }
        if (formData.orderType === "Sell") {
            const selectedAsset = portfolioAssets.find(asset => asset.ticker === value);
            if (selectedAsset) {
                setMaxQuantity(selectedAsset.position);
                setFormData((prev) => ({
                    ...prev,
                    position: selectedAsset.position,
                }))
            }
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true); // Set loading to true when submit starts
        try {
            onSubmit(formData); // Wait for the transaction to be added
            await delay(1500); // Introduce a 1.5-second delay
        } catch (error) {
            console.error("Error while adding transaction:", error);
            window.alert("An error occurred while adding the transaction. Please try again.");
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    const getAssetPrice = async (ticker: string) => {
        try {
            const assetPrice = await fetchCurrentAssetPrice(ticker);
            setFormData((prev) => ({
                ...prev,
                cost: assetPrice, // Set the fetched price to cost
            }));
        } catch (error) {
            console.error("Error fetching asset price: ", error);
        }
    };

    // conditionally display portfolioAssets or assetsData
    const getAssetOptions = () => {
        let chosenAssets;
        let chosenPortfolioAssets;
        // filter assets bacsed on stock/bonds
        if (formData.type === "Stock") {
            chosenAssets = assetsData?.filter(asset => asset.type === "STOCK");
            chosenPortfolioAssets = portfolioAssets.filter(asset => asset.type === "STOCK");
        } else {
            chosenAssets = assetsData?.filter(asset => asset.type === "BOND");
            chosenPortfolioAssets = portfolioAssets.filter(asset => asset.type === "BOND");
        }
        if (formData.orderType === "Buy") {
            return chosenAssets?.map((asset, index) => (
                <SelectItem key={index} value={asset.ticker}>
                    {asset.name}
                </SelectItem>
            ))
        } else {
            return chosenPortfolioAssets.map((asset, index) => (
                <SelectItem key={index} value={asset.ticker}>
                    {asset.name}
                </SelectItem>
            ))
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">Cash Balance:</Label>
                <span>${cashBalance.toFixed(2)}</span>
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">Buying Power:</Label>
                <span className={`${buyingPowerVar > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${buyingPowerVar.toFixed(2)}
                </span>
                {totalCost > 0 && formData.orderType === "Buy" && (
                    <span className="text-red-600">
                        {` (-$${totalCost.toFixed(2)})`}
                    </span>
                )}
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Direction:
                </Label>
                <Select value={formData.orderType} onValueChange={(value) => handleSelectChange("orderType", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {["Buy", "Sell"].map((type, index) => (
                                <SelectItem key={index} value={type}>{type}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Security Type:
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select security type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {["Stock", "Bond"].map((type, index) => (
                                <SelectItem key={index} value={type}>{type}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Security Name:
                </Label>
                <Select
                    value={formData.ticker}
                    onValueChange={(value) => handleSelectChange("ticker", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select stock" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {getAssetOptions()}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Target Price:
                </Label>
                <Input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Quantity:
                </Label>
                <Input
                    type="number"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                />
            </div>
            {/* Show warning if balance is insufficient */}
            <div className={`text-sm mb-2 h-2 ${showWarning ? 'text-red-600 visible' : 'invisible'}`}>
                Insufficient balance to complete this transaction.
            </div>
            {formData.orderType === "Sell" && (
                <div className="text-sm mb-2 h-2 text-red-600">
                    Max  quantity: {maxQuantity}
                </div>
            )}
            <div className="flex gap-2 mt-4">
                {/* <Button className="bg-red-700" onClick={handleSubmit}>Add Transaction to Checkout</Button> */}
                <Button
                    className="bg-red-600 hover:bg-red-800"
                    onClick={handleSubmit}
                    disabled={isLoading || showWarning} // Disable button when loading
                >
                    {isLoading ? "Adding..." : "Add Transaction to Checkout"}
                </Button>
                <Button className="bg-gray-400 text-white" onClick={onReset}>Clear</Button>
            </div>
        </div>
    );
}