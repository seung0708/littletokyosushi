import TotalRevenue from "../../ui/dashboard/total-revenue";
import TotalSales from "../../ui/dashboard/total-sales";
import Active from "../../ui/dashboard/active";
import Transactions from "../../ui/dashboard/transactions";
import RecentSales from "../../ui/dashboard/recent-sales";

const DashboardPage: React.FC = () => {
    return(
      <section className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <TotalRevenue />
                <TotalSales />
                <Active />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Transactions />
                <RecentSales />
            </div>
    </section>
    )
}

export default DashboardPage