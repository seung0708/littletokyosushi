'use client';
import { Database } from '@/types/database.types';

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
}

const PrintReceipt = ({ order }: PrintReceiptProps) => {
    const calculateItemTotal = (item: Order['order_items'][0]) => {
        const modifierTotal = item.itemModifiers.reduce((total, modifier) => {
            return total + modifier.options.reduce((optTotal, opt) => 
                optTotal + opt.price, 0
            );
        }, 0);
        return (item.basePrice + modifierTotal) * item.quantity;
    };

    // Set up print styling
    const originalBodyWidth = document.body.style.width;
    document.body.style.width = '72mm';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Create print content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        throw new Error('Failed to open print window');
    }

    printWindow.document.write(`
        <html>
        <head>
            <title>Order Receipt #${order.short_id}</title>
            <style>
                body {
                    font-family: monospace;
                    width: 72mm;
                    margin: 0;
                    padding: 8px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 16px;
                }
                .item {
                    margin-bottom: 8px;
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
                <p>Order #${order.id}</p>
                <p>${new Date(order.created_at || '').toLocaleString()}</p>
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
                                ${modifier.name}:
                                ${modifier.options.map(option => 
                                    `${option.name} (+$${option.price.toFixed(2)})`
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
    printWindow.document.close();
    printWindow.print();
    printWindow.close();

    // Restore original body styling
    document.body.style.width = originalBodyWidth;
    document.body.style.margin = '';
    document.body.style.padding = '';
};

export default PrintReceipt;
