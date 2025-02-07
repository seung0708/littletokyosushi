import { format, parseISO } from 'date-fns';
import { Order, OrderItem, OrderItemModifier, OrderItemModifierOption } from '@/types/order';
import { Customer } from '@/types/customer';
import { calculateItemTotal } from '@/utils/item';

interface PrintReceiptProps {
    order: Order;
    onClose?: () => void;
}

const PrintReceipt = ({ order, onClose }: PrintReceiptProps) => {

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.contentWindow?.document.write(`
        <html>
        <head>
            <title>Order Receipt #${order.short_id}</title>
            <style>
                * {
                    font-size: 18px;
                }
                body {
                    font-family: monospace;
                    width: 72mm;
                    margin: 0;
                }
                .header {
                    text-align: center;
                }
                .header h2 {
                    font-size: 28px;
                }
                .header p {
                    font-size: 16px;
                }
                .item {
                    margin-bottom: 4px;
                }
                .modifier {
                    padding-left: 16px;
                    font-size: 0.9em;
                }
                .total {
                    margin-top: 16px;
                    border-top: 1px dashed black;
                    padding-top: 8px;
                }
                .footer {
                    margin-top: 16px;
                    text-align: center;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Little Tokyo Sushi</h2>
                <p>Order #${order.short_id}</p>
                <p>
                    ${format(new Date(order.pickup_date.split('+')[0]), 'EEE, M/d/yy')} 
                    ${order.pickup_time && (
                        `${(() => {
                            const [hours, minutes] = order.pickup_time.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours, 10));
                            date.setMinutes(parseInt(minutes, 10));
                            return format(date, 'h:mm a');
                          })()}`
                      )}
                </p>
            </div>

            <div class="customer">
                <p>Customer: ${order.customers.first_name + ' ' + order.customers.last_name || 'Guest'}</p>
                ${order.customers.phone ? `<p>Phone: ${order.customers.phone}</p>` : ''}
            </div>

            <div class="items">
                ${order.items.map((item: OrderItem) => `
                    <div class="item">
                        <p>${item.quantity}x ${item.item_name} - $${calculateItemTotal(item).toFixed(2)}</p>
                        ${item?.modifiers?.map((modifier: OrderItemModifier) => `
                            <div class="modifier">
                                ${modifier.options.map((option: OrderItemModifierOption) => 
                                    `${option.name}`
                                ).join(', ')}
                            </div>
                        `).join('')}
                        ${item?.special_instructions ? `<div class="modifier">Note: ${item.special_instructions}</div>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="total">
                <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
            </div>

            <div class="footer">
                <p>Thank you for your order!</p>
                <p>Visit us again at Little Tokyo Sushi</p>
            </div>
        </body>
        </html>
    `);

    // Print and cleanup
    iframe.contentWindow?.document.close();
    iframe.contentWindow?.print();
    document.body.removeChild(iframe);
    onClose?.();
};

export default PrintReceipt;
