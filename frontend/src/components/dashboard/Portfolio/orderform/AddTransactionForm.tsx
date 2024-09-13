import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Asset } from "@/lib/types";
import { fetchCurrentAssetPrice } from "@/api/asset";
import { delay } from "@/utils/utils";

interface AddTransactionFormProps {
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

export default function AddTransactionForm({ assetsData, formData, setFormData, onSubmit, onReset }: AddTransactionFormProps) {
    // Loading state
    const [isLoading, setIsLoading] = useState(false); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = async (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Fetch asset price if security name is selected
        if (name === "ticker") {
            await getAssetPrice(value);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true); // Set loading to true when submit starts
        try {
            onSubmit(formData); // Wait for the transaction to be added
            await delay(1500); // Introduce a 10-second delay
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

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Order Type:
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
                            {["Stock", "Asset"].map((type, index) => (
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
                        {assetsData?.map((asset, index) => (
                            <SelectItem key={index} value={asset.ticker}>
                            {asset.name}
                            </SelectItem>
                        ))}
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
            <div className="flex gap-2 mt-4">
                {/* <Button className="bg-red-700" onClick={handleSubmit}>Add Transaction to Checkout</Button> */}
                <Button
                    className="bg-red-700"
                    onClick={handleSubmit}
                    disabled={isLoading} // Disable button when loading
                >
                    {isLoading ? "Adding..." : "Add Transaction to Checkout"}
                </Button>
                <Button className="bg-gray-400 text-white" onClick={onReset}>Clear</Button>
            </div>
        </div>
    );
}