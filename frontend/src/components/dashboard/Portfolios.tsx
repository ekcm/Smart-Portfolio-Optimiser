import { PortfolioData } from "@/lib/mockData";
import IndivPortfolioCard from "./IndivPortfolioCard";
import { useToast } from "@/components/ui/use-toast"

export default function Portfolios() {
    const { toast } = useToast()

    return (
        <div className="flex flex-col items-center gap-6">
            {PortfolioData.map((portfolio, index) => (
                <IndivPortfolioCard key={index} data={portfolio}/>
            ))}
        </div>
    )
}