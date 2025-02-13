import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface VisitsCardProps {
  visits: number
  change: number
  loading?: boolean
}

export default function VisitsCard({ visits, change, loading }: VisitsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 animate-pulse bg-muted rounded" />
        ) : (
          <>
            <div className="text-2xl font-bold">{visits}</div>
            <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}% from last week
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}