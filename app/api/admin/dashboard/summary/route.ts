import { createClient } from "@/lib/supabase/server"
import { NextResponse } from 'next/server'
import { startOfDay, subDays } from 'date-fns'
import { getAnalytics } from "@/lib/google-analytics"
import { format } from "date-fns"

export async function GET() {
  const supabase = await createClient()
  const days = 7 // Last 7 days

  try {
    const endDate = startOfDay(new Date())
    const startDate = subDays(endDate, days)
    const previousStartDate = subDays(startDate, days)

    const analyticsData = await getAnalytics(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    )
    console.log(analyticsData)
    const previousAnalytics = await getAnalytics(
      format(previousStartDate, 'yyyy-MM-dd'),
      format(startDate, 'yyyy-MM-dd')
    )

    // Current period data
    const { data: currentOrders, error: currentError } = await supabase
      .from('orders')
      .select(`created_at, total, sub_total, order_items(*)`)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
  
    // Previous period data for comparison
    const { data: previousOrders, error: previousError } = await supabase
      .from('orders')
      .select(`created_at, total, sub_total, order_items(*)`)
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString())

    if (currentError || previousError) throw currentError || previousError

    // Calculate totals and changes
    const currentTotals = {
      revenue: currentOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
      sales: currentOrders?.reduce((sum, order) => sum + (order.sub_total || 0), 0) || 0,
      orders: currentOrders?.length || 0
    }

    const previousTotals = {
      revenue: previousOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
      sales: previousOrders?.reduce((sum, order) => sum + (order.sub_total || 0), 0) || 0,
      orders: previousOrders?.length || 0
    }

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => 
      previous === 0 ? 0 : Number(((current - previous) / previous * 100).toFixed(1))

    return NextResponse.json({
      totals: {
        ...currentTotals,
        revenueChange: calculateChange(currentTotals.revenue, previousTotals.revenue),
        salesChange: calculateChange(currentTotals.sales, previousTotals.sales),
        ordersChange: calculateChange(currentTotals.orders, previousTotals.orders),
        visits: analyticsData?.activeUsers || 0,
        visitsChange: calculateChange(
          analyticsData?.activeUsers || 0,
          previousAnalytics?.activeUsers || 0
        ),
        pageViews: analyticsData?.pageViews || 0,
        sessions: analyticsData?.sessions || 0,
        avgSessionDuration: analyticsData?.avgSessionDuration || 0
      }
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}