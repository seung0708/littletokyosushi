
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface TotalRevenueProps {
  amount: number
  change: number
  loading?: boolean
}

export default function TotalRevenue({amount, change, loading}: TotalRevenueProps) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-24 animate-pulse bg-muted rounded" />
          ) : (
          <>
            <div className="text-2xl font-bold">${amount.toFixed(2)}</div>
            <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}% from last week
            </p>
          </>
        )}
        </CardContent>
      </Card>
    )
}