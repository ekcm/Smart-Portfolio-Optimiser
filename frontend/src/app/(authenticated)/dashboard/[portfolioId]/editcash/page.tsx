"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import { usePathname } from "next/navigation";
import { updatePortfolioCash, viewBasicPortfolio } from "@/api/portfolio";
import EditCashForm from "@/components/dashboard/Portfolio/addcashform/AddCashForm";
import Error from "@/components/error/Error";
import { useToast } from "@/components/ui/use-toast";
import { useTransitionRouter } from "next-view-transitions";

export default function AddCash() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    const { toast } = useToast();
    const router = useTransitionRouter();
    // TODO: Pull data from backend for current cash balance
    const [isLoading, setIsLoading] = useState(true);
    const [cashBalance, setCashBalance] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    });

    useEffect(() => {
        if (portfolioId) {
            getPortfolioCashBalance(portfolioId);
        }
    }, [portfolioId]);
    
    const updateCash = async (transactionType: string, amount: number) => {
        setIsSubmitting(true); // Disable button when API call starts
        try {
            const updateCashResponse = await updatePortfolioCash(portfolioId, amount, transactionType);
            toast({
                title: `Cash ${transactionType === 'ADD' ? 'Added' : 'Withdrawn'}`,
                description: `$${amount} has been ${transactionType === 'ADD' ? 'added to' : 'withdrawn from'} your account. We will teleport you to the main portfolio dashboard now!`,
            });
            router.back();
        } catch (error) {
            console.error("Error fetching portfolio data: ", error);
            setError("Failed to fetch portfolio data");
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with your request: ${error}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const getPortfolioCashBalance = async (portfolioId : string) => {
        try {
            const portfolioData = await viewBasicPortfolio(portfolioId);
            setCashBalance(portfolioData.cashAmount);
        } catch (error) {
            console.error("Error fetching portfolio data: ", error);
            setError("Failed to fetch portfolio data");
        } finally {
            setIsLoading(false);
        }
    }

    if (error) return <Error error={error} />;

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <EditCashForm isLoading={isLoading || isSubmitting} cashBalance={cashBalance} onAddCash={updateCash}/>
        </main>
    )
}