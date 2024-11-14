import { Card } from "@/components/ui/card";
import TriggeredAlert from "../TriggeredAlert";
import AddTransactionForm from "./AddTransactionForm";
import { useState } from "react";
import { AddTransactionDataType, Alert, Asset, PortfolioHoldings, RuleReport } from "@/lib/types";

interface AddTransactionCardProps {
    portfolioId: string;
    cashBalance: number;
    buyingPower: number;
    // stocks in this portfolio
    portfolioAssets: PortfolioHoldings[];
    // all stocks + their respective market price
    assetsData: Asset[] | undefined;
    triggeredAlerts: Alert[];
    ruleReport: RuleReport;
    addTransaction: (data: AddTransactionDataType) => void;
}

export default function AddTransactionCard({ portfolioId, buyingPower, cashBalance, portfolioAssets, assetsData, ruleReport, triggeredAlerts, addTransaction }: AddTransactionCardProps) {
    const initialFormData = {
        type: "Stock",
        ticker: "",
        cost: 0,
        position: 0,
        orderType: "Buy",
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleFormSubmit = (data: typeof formData) => {
        // console.log("Form Data:", data);
        addTransaction(data);
        handleFormReset();
    };

    const handleFormReset = () => {
        setFormData(initialFormData);
    };

    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Add Transaction</h2>
                    <AddTransactionForm
                        cashBalance={cashBalance}
                        buyingPower={buyingPower}
                        portfolioAssets={portfolioAssets}
                        assetsData={assetsData}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleFormSubmit}
                        onReset={handleFormReset}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <TriggeredAlert type="orderForm" data={triggeredAlerts} ruleReport={ruleReport} />
                </div>
            </div>
        </Card>
    )
}