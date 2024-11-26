import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, FileText, User } from "lucide-react"
import { RuleLog } from "@/lib/types"
import { ruleTypes } from "@/utils/constants";

interface RuleCardProps {
    key: number;
    rule: RuleLog;
}

export default function RuleCard({ rule }: RuleCardProps) {
    const ruleLabel = ruleTypes.find((type) => type.value === rule.ruleType)?.label || rule.ruleType;
    const formatDate = (dateString: Date) => {
        const date = new Date(String(dateString));
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
            timeZone: 'UTC',
        }).format(date);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div>
                        <span>Rule: </span>
                        <Badge variant="outline" className="ml-2 font-bold text-base px-3 py-1">
                            {ruleLabel}
                        </Badge>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-md font-medium">Timestamp: </span>
                        <span className="ml-2 text-sm">{formatDate(rule.timestamp)} (UTC)</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-md font-medium">Manager ID: </span>
                        <span className="ml-2 text-md">{rule.managerId}</span>
                    </div>
                    <div className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-md font-medium">Description: </span>
                        <span className="ml-2 text-md">{rule.description}</span>
                    </div>
                    <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-md font-medium">Change Message: </span>
                        <span className="ml-2 text-md">{rule.changeMessage}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}