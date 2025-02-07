'use client';

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Order } from '@/types/order';

interface ActionButtonsProps {
    order: Order;
    onMarkReady?: () => void;
    onPrint?: () => void;
    onComplete?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    order,
    onMarkReady,
    onPrint,
    onComplete
}) => {
    const isPreparing = order.status === 'preparing';
    const isReady = order.status === 'ready';

    return (
        <div className="flex gap-2 mt-4">
            {isPreparing && (
                <Button 
                    onClick={onMarkReady}
                    variant="default"
                    className="flex items-center gap-2"
                >
                    Mark as Ready
                </Button>
            )}
            
            {isReady && (
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
};

export default ActionButtons;
