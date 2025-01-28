import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface ActionButtonsProps {
    order: any
    onMarkReady: () => void
    onComplete: () => void
    onPrint: () => void
  }
  
  export default function ActionButtons({ order, onMarkReady, onComplete, onPrint }: ActionButtonsProps) {
    return (
      <div className="flex gap-2 mt-4">
        {order.status === 'preparing' && (
          <Button 
            onClick={onMarkReady}
            variant="default"
            className="flex items-center gap-2"
          >
            Mark as Ready
          </Button>
        )}
        
        {order.status === 'ready' && (
          <Button 
            onClick={onComplete}
            variant="default"
            className="flex items-center gap-2"
          >
            Complete Order
          </Button>
        )}
  
        <Button
          onClick={onPrint}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    );
  }
