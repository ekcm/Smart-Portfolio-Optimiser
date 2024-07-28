import { PortfolioData } from "@/lib/mockData"
import IndivPortfolioCard from "./IndivPortfolioCard"

export default function Portfolios() {
    
    return (
        <div className="flex flex-col items-center gap-6">
            {PortfolioData.map((portfolio, index) => (
                <IndivPortfolioCard key={index} data={portfolio}/>
            ))}
        </div>
    )
}