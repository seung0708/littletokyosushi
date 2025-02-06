'use client';
import { Database } from '@/types/database.types';
import { format, parseISO } from 'date-fns';



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

interface PrintReceiptProps {
    order: Order;
    onClose?: () => void;
}

const PrintReceipt = ({ order, onClose }: PrintReceiptProps) => {
    const calculateItemTotal = (item: Order['order_items'][0]) => {
        const modifierTotal = item.itemModifiers.reduce((total: number, modifier) => {
            return total + modifier.options.reduce((optTotal, opt) => 
                optTotal + opt.price, 0
            );
        }, 0);

        return (item.price + modifierTotal) * item.quantity;
    };

    // Create print content
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
                    ${format(new Date(order.pickupDate.split('+')[0]), 'EEE, M/d/yy')} 
                    ${order.pickupTime && (
                        `${(() => {
                            const [hours, minutes] = order.pickupTime.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours, 10));
                            date.setMinutes(parseInt(minutes, 10));
                            return format(date, 'h:mm a');
                          })()}`
                      )}
                </p>
            </div>

            <div class="customer">
                <p>Customer: ${order.customerFirstName + ' ' + order.customerLastName || 'Guest'}</p>
                ${order.customerPhone ? `<p>Phone: ${order.customerPhone}</p>` : ''}
            </div>

            <div class="items">
                ${order.items.map(item => `
                    <div class="item">
                        <p>${item.quantity}x ${item.name} - $${calculateItemTotal(item).toFixed(2)}</p>
                        ${item.itemModifiers.map(modifier => `
                            <div class="modifier">
                                ${modifier.options.map(option => 
                                    `${option.name}`
                                ).join(', ')}
                            </div>
                        `).join('')}
                        ${item.notes ? `<div class="modifier">Note: ${item.notes}</div>` : ''}
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
