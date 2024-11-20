import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table'

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
    return(
        <Card x-chunk={`${shimmer}dashboard-01-chunk-1`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"></div>
          <p className="text-xs text-muted-foreground">
          </p>
        </CardContent>
      </Card>
    )
}

export function RecentSalesSkeleton() {
    return (
        <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
            <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
                <div className="flex items-center gap-4">
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none"></p>
                        <p className="text-sm text-muted-foreground"></p>
                    </div>
                    <div className="ml-auto font-medium"></div>
                </div>
            </CardContent>
        </Card>
    )
}

export function RecentTransactionsSkeleton() {
    return (
        <Card
          className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
        >
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle></CardTitle>
              <CardDescription>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Type
                  </TableHead>
                  <TableHead className="hidden xl:table-column">
                    Status
                  </TableHead>
                  <TableHead className="hidden xl:table-column">
                    Date
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium"></div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">            
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    )
}

export default function DashboardSkeleton() {
    return (
        <section className={`${shimmer} flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8`}>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <RecentTransactionsSkeleton />
                <RecentSalesSkeleton />
            </div>
    </section>
    )
}