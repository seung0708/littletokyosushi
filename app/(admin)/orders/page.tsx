import OrderSummary from "@/components/admin/order-summary"
import OrdersList from "@/components/admin/orders-list"
import RecentOrder from "@/components/admin/recent-order"

const OrdersPage: React.FC = () => {
    return (
      <section className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <OrderSummary />
        </div>
        <OrdersList />
      </div>
      <RecentOrder />
    </section>
    )
}

export default OrdersPage