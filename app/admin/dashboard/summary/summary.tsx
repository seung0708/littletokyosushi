import Active from "./active";
import RecentSales from "./recent-sales";
import TotalRevenue from "./total-revenue";
import TotalSales from "./total-sales";
import Transactions from "./transactions";


export default function Summary() {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <TotalRevenue />
                <TotalSales />
                <Active />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Transactions />
                <RecentSales />
            </div>
        </>
    )
}