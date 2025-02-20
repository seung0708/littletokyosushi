import { Order } from "@/types/order"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"


interface OrdersTableProps {
    orders: Order[]
    showActions?: boolean
    columns?: {
        orderNumber?: boolean
        customer?: boolean
        type?: boolean
        status?: boolean
        fulfillmentDate?: boolean
        total?: boolean
        actions?: boolean
    }

}

export default function OrdersTable({orders, columns}: OrdersTableProps) {
    return (
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="sm:table-cell">Type</TableHead>
            <TableHead className="sm:table-cell">Status</TableHead>
            <TableHead className="md:table-cell">Fulfillment Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader> 
        <TableBody>
          {orders?.map((order: Order) => (
            <TableRow key={order?.short_id} className="bg-accent">
              <TableCell className="font-medium">
                {order?.short_id?.toUpperCase()}
              </TableCell>
              <TableCell>
                  {order?.customers?.first_name} {order?.customers?.last_name}
              </TableCell>  
              <TableCell className="sm:table-cell">
                {order?.order_type?.toUpperCase()}
              </TableCell>
              <TableCell className="sm:table-cell">
                <Badge className="text-xs" variant="default">
                  {order?.status?.toUpperCase().split('_').join(' ')}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                  {order?.order_type === 'pickup' && order?.pickup_date && (
                    <>
                      {format(new Date(order?.pickup_date), 'EEEE, MMMM d, yyyy')}{' '}
                      {order?.pickup_time && (
                        <>
                          {(() => {
                            const [hours, minutes] = order?.pickup_time?.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours, 10));
                            date.setMinutes(parseInt(minutes, 10));
                            return format(date, 'h:mm a');
                          })()}
                        </>
                      )}
                    </>
                  )}
                  {order.order_type === 'delivery' && order.delivery_date && (
                    <>
                      {format(new Date(order.delivery_date), 'EEEE, MMMM d, yyyy')}{' '}
                      {order?.delivery_time && (
                        <>
                          {(() => {
                            const [hours, minutes] = order?.delivery_time?.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours, 10));
                            date.setMinutes(parseInt(minutes, 10));
                            return format(date, 'h:mm a');
                          })()}
                        </>
                      )}
                    </>
                  )}
              </TableCell>
              <TableCell className="text-right">
                ${order?.total}
              </TableCell>
              <TableCell>
                      <Link href={`/admin/orders/${order?.short_id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}