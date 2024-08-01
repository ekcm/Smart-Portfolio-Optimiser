import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TriggeredAlertProps {
    data: string[]
}

export default function TriggeredAlert({ data } : TriggeredAlertProps) {
    if (data.length === 0) {
        return <></>
    };
    
    return (
        <Card className="flex flex-col w-full py-4 px-4 bg-red-100 gap-2">
            <h2 className="text-xl font-medium">Triggered Alerts:</h2>
            <h3 className="text-md text-gray-600">Portfolio has breached the following categories:</h3>
            <ul className="list-disc px-8">
                {data.map((item, index) => (
                    <li className="text-gray-600" key={index}>{item}</li>
                ))}
            </ul>
        </Card>
    )
}