import { Order } from "@/types/order";
import { Loading } from '@/components/ui/loading';
import OrdersTable from "./orders-table";

interface OrdersContainerProps {
    title: string
    orders: Order[]
    loading: boolean
    children?: React.ReactNode
    audioControl?: React.ReactNode
}
  
export default function OrdersContainer({title, orders, loading, children, audioControl }: OrdersContainerProps) {
    return (
        <div>
          <div className="flex pb-6 justify-between items-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            {audioControl && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Notification Sound</span>
                {audioControl}
              </div>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loading variant="admin" size="md" />
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <OrdersTable 
                  orders={orders}
                  columns={{
                    orderNumber: true,
                    customer: true,
                    type: true,
                    status: true,
                    fulfillmentDate: true,
                    total: true,
                    actions: true,
                  }}
                />
              </div>
              {children}
            </>
          )}
        </div>
    )
}