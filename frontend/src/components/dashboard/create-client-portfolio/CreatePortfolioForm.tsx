"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { useTransitionRouter } from 'next-view-transitions';
import { useState } from "react";

// Define the type for the form data
type FormData = z.infer<typeof formSchema>;

export default function CreatePortfolioForm() {
    const router = useTransitionRouter();
    const formSchema = z.object({
      clientEmail: z.string().email({ message: "Invalid email address" }),
      portfolioName: z.string().min(2, { message: "Portfolio name must be at least 2 characters." }),
      riskAppetite: z.enum(["Low", "Medium", "High"], { message: "Select a valid risk appetite" }),
      cash: z.number().min(0, { message: "Cash amount must be at least 0" }),
      exclusions: z.array(z.string().min(1, { message: "Exclusion cannot be empty" })),
    });

    const { handleSubmit, control, setValue, watch } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientEmail: "",
            portfolioName: "",
            riskAppetite: "",
            cash: 0,
            exclusions: [],
        },
    });

    const exclusions = watch("exclusions");
    const [exclusionInput, setExclusionInput] = useState("");

    const handleAddExclusion = () => {
        if (exclusionInput) {
            setValue("exclusions", [...exclusions, exclusionInput]);
            setExclusionInput("");
        }
    };

    const handleRemoveExclusion = (index: number) => {
        setValue("exclusions", exclusions.filter((_, i) => i !== index));
    };

    const onSubmit = (data: FormData) => {
        // Submit form logic here
        console.log("Form data submitted:", data);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-8">
            <div className="flex flex-col w-1/2 gap-4">
                <Controller
                    control={control}
                    name="clientEmail"
                    render={({ field, fieldState }) => (
                        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                            Portfolio Client:
                            <Input
                                type="text"
                                {...field}
                                className={fieldState.invalid ? "border-red-500" : ""}
                            />
                            {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
                        </Label>
                    )}
                />

                <Controller
                    control={control}
                    name="portfolioName"
                    render={({ field, fieldState }) => (
                        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                            Portfolio Name:
                            <Input
                                type="text"
                                {...field}
                                className={fieldState.invalid ? "border-red-500" : ""}
                            />
                            {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
                        </Label>
                    )}
                />

                <Controller
                    control={control}
                    name="riskAppetite"
                    render={({ field, fieldState }) => (
                        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                            Client Risk Appetite:
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select risk appetite" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {["Low", "Medium", "High"].map((risk, index) => (
                                            <SelectItem key={index} value={risk}>{risk}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
                        </Label>
                    )}
                />

                <Controller
                    name="cash"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                            Portfolio Cash Amount:
                            <Input
                                type="number"
                                {...field}
                                value={field.value.toString()}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                className={fieldState.invalid ? "border-red-500" : ""}
                            />
                            {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
                        </Label>
                    )}
                />

                <Label className="flex flex-col space-x-2 whitespace-nowrap text-md gap-2">
                    Exclusions List:
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={exclusionInput}
                            onChange={(e) => setExclusionInput(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="button" onClick={handleAddExclusion}>Add</Button>
                    </div>
                    <ul className="mt-2 list-disc list-inside">
                        {exclusions.map((exclusion, index) => (
                            <li key={index} className="flex items-center justify-between">
                                {exclusion}
                                <Button type="button" onClick={() => handleRemoveExclusion(index)} size="sm" variant="destructive">Remove</Button>
                            </li>
                        ))}
                    </ul>
                </Label>
            </div>
            <div className="flex gap-2 mt-4">
                <Button type="submit" className="bg-red-500">Confirm Orders</Button>
                <Button type="button" className="bg-gray-400 text-white" onClick={(e) => {
                    e.preventDefault()
                    router.back()
                }}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}