import DashboardSummary from "@/components/admin/dashboard/summary-stats";

const DashboardPage: React.FC = () => {
    return(
        <div className="flex-1 space-y-4 pt-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <DashboardSummary />
      </div>
    )
}

export default DashboardPage