import TotalRevenue from "@/components/admin/total-revenue";
import TotalSales from "@/components/admin/total-sales";
import Active from "@/components/admin/active";
import Transactions from "@/components/admin/transactions";
import RecentSales from "@/components/admin/recent-sales";

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