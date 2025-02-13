import { Order } from "@/types/order";
import { Loading } from '@/components/ui/loading';
import OrdersTable from "./orders-table";

interface OrdersContainerProps {
    title: string
    orders: Order[]
    loading: boolean
    children?: React.ReactNode
  }
  
export default function OrdersContainer({title, orders, loading, children }: OrdersContainerProps) {
    return (
        <div>
          <div className="flex space-y-4 pb-6 justify-between items-center">
            <h1 className="text-3xl font-bold">{title}</h1>
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