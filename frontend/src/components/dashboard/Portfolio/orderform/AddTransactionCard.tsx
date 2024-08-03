import { Card } from "@/components/ui/card";
import TriggeredAlert from "../TriggeredAlert";
import AddTransactionForm from "./AddTransactionForm";
import { useState } from "react";
import { AddTransactionDataType } from "@/lib/types";

interface AddTransactionCardProps {
    portfolioId: number;
    addTransaction: (data: AddTransactionDataType) => void;
}

// TODO: Check on how formdata is gna be tracked/sent to backend OR just update on orders checkout since there is missing information (eg quantity)
export default function AddTransactionCard({ portfolioId, addTransaction} : AddTransactionCardProps) {
    const initialFormData = {
        securityType: "",
        securityName: "",
        targetPrice: 0,
        quantity: 0,
        transactionType: "Buy",
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleFormSubmit = (data: typeof formData) => {
        // Send API request with form data
        // ! Maybe call api for all info for chosen stock and then the returned info send up thru addTransaction()
        console.log("Form Data:", data);
        addTransaction(data);
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