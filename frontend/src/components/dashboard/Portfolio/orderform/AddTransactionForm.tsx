import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";

interface AddTransactionFormProps {
    formData: {
        securityType: string;
        securityName: string;
        targetPrice: number;
        quantity: number;
        transactionType: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        securityType: string;
        securityName: string;
        targetPrice: number;
        quantity: number;
        transactionType: string;
    }>>;
    onSubmit: (data: {
        securityType: string;
        securityName: string;
        targetPrice: number;
        quantity: number;
        transactionType: string;
    }) => void;
    onReset: () => void;
}

export default function AddTransactionForm({ formData, setFormData, onSubmit, onReset }: AddTransactionFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            transactionType: value,
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Order Type:
                </Label>
                <Select value={formData.transactionType} onValueChange={handleSelectChange}>
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
                <Input 
                    type="text"
                    name="securityType"
                    value={formData.securityType}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Security Name:
                </Label>
                <Input 
                    type="text"
                    name="securityName"
                    value={formData.securityName}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Target Price:
                </Label>
                <Input 
                    type="number"
                    name="targetPrice"
                    value={formData.targetPrice}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 items-center">
                <Label className="w-40 text-md font-light">
                    Quantity:
                </Label>
                <Input 
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-2 mt-4">
                <Button className="bg-red-700" onClick={handleSubmit}>Add Transaction to Checkout</Button>
                <Button className="bg-gray-400 text-white" onClick={onReset}>Clear</Button>
            </div>
        </div>
    );
}