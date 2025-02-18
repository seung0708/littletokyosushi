"use client"


import TotalRevenue from '../total-revenue'
import TotalSales from '../total-sales'
import VisitsCard from '../visits-card'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, TrendingDown } from 'lucide-react'

export default function DashboardSummary() {
  const [loading, setLoading] = useState(true)
  const [totals, setTotals] = useState({
    revenue: 0,
    sales: 0,
    orders: 0,
    visits: 0,
    visitsChange: 0,
    revenueChange: 0,
    salesChange: 0,
    ordersChange: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/summary')
        const { totals } = await response.json()
        setTotals(totals)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <div className="grid gap-2 md:grid-cols-4">
        <TotalRevenue 
          amount={totals.revenue} 
          change={totals.revenueChange} 
          loading={loading} 
        />
        <TotalSales 
          amount={totals.sales} 
          change={totals.salesChange} 
          loading={loading} 
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 animate-pulse bg-muted rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totals.orders}</div>
                <div className="flex items-center pt-1">
                  {totals.ordersChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <p className={`text-xs ${totals.ordersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totals.ordersChange >= 0 ? '+' : ''}{totals.ordersChange}% from last week
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <VisitsCard 
          visits={totals.visits} 
          change={totals.visitsChange} 
          loading={loading} 
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="space-y-1 flex-1">
                      <div className="h-4 w-[60%] bg-muted rounded animate-pulse" />
                      <div className="h-3 w-[40%] bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Recent activity will be shown here
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="space-y-1 flex-1">
                      <div className="h-4 w-[60%] bg-muted rounded animate-pulse" />
                      <div className="h-3 w-[40%] bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Top selling items will be shown here
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}