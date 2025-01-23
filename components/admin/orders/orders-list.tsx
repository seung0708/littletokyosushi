"use client"

import Link from 'next/link'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListFilter, File } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardHeader,CardTitle} from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,   DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { format } from 'date-fns'

export default function OrdersList() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      console.log(data)
      setOrders(data)
    }
    fetchOrders()
  }, [])

    return (
        <>
        <Tabs defaultValue="week">
        {/* <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-sm"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Fulfilled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Declined
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Refunded
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-sm"
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div> */}
        <TabsContent value="week">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Type
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id} className="bg-accent">
                      {/* Each cell becomes a link */}
                      <TableCell>
                        <Link href={`/admin/orders/${order.id}`} className="block hover:opacity-80">
                          <div className="font-medium">
                            {order.customers.first_name} {order.customers.last_name}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {order.customers.email}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Link href={`/admin/orders/${order.id}`} className="block hover:opacity-80">
                          {order.order_type.toUpperCase()}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Link href={`/admin/orders/${order.id}`} className="block hover:opacity-80">
                          <Badge className="text-xs" variant="secondary">
                            {order.status.toUpperCase().split('_').join(' ')}
                          </Badge>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Link href={`/admin/orders/${order.id}`} className="block hover:opacity-80">
                          {format(new Date(order.created_at), "MMMM d, yyyy h:mm a")}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.id}`} className="block hover:opacity-80">
                          ${order.total}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </>
    )
}