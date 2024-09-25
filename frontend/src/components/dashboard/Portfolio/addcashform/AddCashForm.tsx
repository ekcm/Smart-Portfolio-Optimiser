"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransitionRouter } from "next-view-transitions";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddCashFormProps {
    isLoading: boolean;
    cashBalance: number;
    onAddCash: (transactionType: string, amount: number) => void;
}

export default function EditCashForm({ isLoading, cashBalance, onAddCash } : AddCashFormProps) {
    // TODO: Add error handling for invalid input
    // TODO: Add form input for updating cash
    // TODO: Add onSubmit function to form that calls onAddCash on parent component
    const router = useTransitionRouter();

    const [amount, setAmount] = useState(0);
    const [transactionType, setTransactionType] = useState('ADD');
    const [error, setError] = useState("");

    const transactionTypes = {
        ADD: "Add",
        WITHDRAW: "Withdraw",
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0) {
            setError("Please enter a positive number");
            return;
        }
        onAddCash(transactionType, amount);
    }

    return (
        <div>
            <div className="flex w-1/2 justify-between">
                <h1 className="text-3xl font-semibold">{transactionType === "ADD" ? "Add" : "Withdraw" } Cash</h1>
                <div>
                    <h1 className="text-xl font-medium">Cash Balance: </h1>
                    {isLoading ? 
                        <Skeleton className="w-[100px] h-[25px] rounded-full" />
                    : 
                        <span className="text-md">${cashBalance.toFixed(2)}</span>
                    }
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid items-center space-y-8 w-1/2">
                    <div className="flex flex-col gap-2">
                        <Label className="flex flex-col space-x-2 whitespace-nowrap text-lg">
                            Transaction Type:
                            <Select value={transactionType} onValueChange={(value) => setTransactionType(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Transaction Type" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectGroup>
                                    {Object.entries(transactionTypes).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value}
                                    </SelectItem>
                                    ))}
                                </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Label>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="flex flex-col space-x-2 whitespace-nowrap text-lg">
                            Amount
                            <Input 
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(Number(e.target.value))
                                    setError("")
                                }}
                                // min="0"
                                required
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </Label>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button type="button" className="bg-gray-400 text-white" onClick={(e) => {
                        e.preventDefault()
                        router.back()
                    }}>
                        Cancel
                    </Button>
                    {/* <Button type="submit" className="bg-red-500">{transactionType === "ADD" ? "Add" : "Withdraw" } Cash</Button> */}
                    <Button 
                        type="submit" 
                        className="bg-red-500" 
                        disabled={isLoading} // Disable button if loading
                    >
                        {isLoading ? "Processing..." : `${transactionType === "ADD" ? "Add" : "Withdraw"} Cash`}
                    </Button>
                </div>
            </form>
        </div>
    )
}