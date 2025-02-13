
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface TotalSalesProps {
  amount: number
  change: number
  loading?: boolean
}

export default function TotalSales({amount, change, loading}: TotalSalesProps) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-24 animate-pulse bg-muted rounded" />
          ) : (
          <>
            <div className="text-2xl font-bold">{amount}</div>
            <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}% from last week
            </p>
          </>
        )}
        </CardContent>
      </Card>
    )
}