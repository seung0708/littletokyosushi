import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function ActionButtons({order, onMarkReady, onPrint}) {
    return (
        <div className="flex gap-2 w-full">
        {order.status === 'preparing' && (
          <Button
            onClick={onMarkReady}
            type="button"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Mark as Ready
          </Button>
        )}
        <Button
          onClick={onPrint}
          type="button"
          variant="outline"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          <span>Print Receipt</span>
        </Button>
      </div>    
    )
}
