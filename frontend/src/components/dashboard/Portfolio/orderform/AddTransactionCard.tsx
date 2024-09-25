import { Card } from "@/components/ui/card";
import TriggeredAlert from "../TriggeredAlert";
import AddTransactionForm from "./AddTransactionForm";
import { useState } from "react";
import { AddTransactionDataType, Asset } from "@/lib/types";

interface AddTransactionCardProps {
    portfolioId: string;
    cashBalance: number;
    assetsData: Asset[] | undefined;
    addTransaction: (data: AddTransactionDataType) => void;
}

// TODO: Check on how formdata is gna be tracked/sent to backend OR just update on orders checkout since there is missing information (eg quantity)
export default function AddTransactionCard({ portfolioId, cashBalance, assetsData, addTransaction }: AddTransactionCardProps) {
    const initialFormData = {
        type: "",
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
                        assetsData={assetsData}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleFormSubmit}
                        onReset={handleFormReset}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <TriggeredAlert type="orderForm" data={[]} />
                </div>
            </div>
        </Card>
    )
}