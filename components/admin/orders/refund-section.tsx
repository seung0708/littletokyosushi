'use client';

import { useState } from 'react';
import { Database } from '@/types/database.types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Order = Database['public']['Tables']['orders']['Row'] & {
    customer: Database['public']['Tables']['customers']['Row'];
    order_items: Array<
        Database['public']['Tables']['order_items']['Row'] & {
            menu_item: Database['public']['Tables']['items']['Row'];
            order_item_modifiers: Array<
                Database['public']['Tables']['order_item_modifiers']['Row'] & {
                    order_item_modifier_options: Array<
                        Database['public']['Tables']['order_item_modifier_options']['Row']
                    >;
                }
            >;
        }
    >;
};

interface RefundSectionProps {
    order: Order;
    onRefund: (values: { amount: number; reason: string }) => Promise<void>;
}

const RefundSection: React.FC<RefundSectionProps> = ({ order, onRefund }) => {
    const [amount, setAmount] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRefund = async () => {
        if (!amount || !reason) {
            setError('Please provide both amount and reason for refund');
            return;
        }

        const refundAmount = parseFloat(amount);
        if (isNaN(refundAmount) || refundAmount <= 0 || refundAmount > order.total) {
            setError('Invalid refund amount');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            await onRefund({ amount: refundAmount, reason });
            setAmount('');
            setReason('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process refund');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Process Refund</h3>
            <div className="grid gap-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Refund Amount
                    </label>
                    <div className="mt-1">
                        <Input
                            type="number"
                            id="amount"
                            step="0.01"
                            min="0"
                            max={order.total}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter refund amount"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                        Reason for Refund
                    </label>
                    <div className="mt-1">
                        <Input
                            type="text"
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for refund"
                        />
                    </div>
                </div>
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                <Button
                    onClick={handleRefund}
                    disabled={isProcessing || !amount || !reason}
                >
                    {isProcessing ? 'Processing...' : 'Process Refund'}
                </Button>
            </div>
        </div>
    );
};

export default RefundSection;