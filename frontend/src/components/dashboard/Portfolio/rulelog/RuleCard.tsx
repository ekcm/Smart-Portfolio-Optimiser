import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, CreditCard, FileText, Hash, User } from "lucide-react"
import { RuleLog } from "@/lib/types"

interface RuleCardProps {
    rule: RuleLog;
}

export default function RuleCard({ rule }: RuleCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span>Rule: </span>
          <Badge variant="outline" className="ml-2 font-bold text-base px-3 py-1">
            {rule.ruleType}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Description: </span>
            <span className="ml-2 text-sm">{rule.description}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Timestamp: </span>
            <span className="ml-2 text-sm">{formatDate(rule.timestamp)}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Manager ID: </span>
            <span className="ml-2 text-sm">{rule.managerId}</span>
          </div>
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Change Message: </span>
            <span className="ml-2 text-sm">{rule.changeMessage}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}