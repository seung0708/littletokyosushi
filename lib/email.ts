import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/order-confirmation';
import PrepTimeNotificationEmail from '@/emails/prep-time-notifications';
import OrderReadyNotificationEmail from '@/emails/order-ready-notification';
import { Order } from '@/types/order';
import { Customer } from '@/types/customer';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(order: Order, customer: Customer) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'orders@resend.dev',  // Temporary test domain
            to: 'seung.kim0708@gmail.com',
            subject: `Order Confirmation #${order.id}`,
            react: OrderConfirmationEmail({
                order,
                customer,
            }),
        });

        if (error) {
            console.error('Failed to send email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}

export async function sendPrepTimeNotificationEmail(order: Order, customer: Customer) {
    try {
        if (!order.short_id || !order.prep_time_minutes || !customer.first_name) {
            throw new Error('Missing required fields for prep time notification email');
        }

        const { data, error } = await resend.emails.send({
            from: 'orders@resend.dev',
            to: customer.email as string,
            subject: `Order Update: Your order #${order.short_id} is being prepared`,
            react: PrepTimeNotificationEmail({
                order: {
                    short_id: order.short_id,
                    prep_time_minutes: order.prep_time_minutes
                },
                customer: {
                    first_name: customer.first_name
                }
            }),
        });

        if (error) {
            console.error('Failed to send prep time notification:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending prep time notification:', error);
        return { success: false, error };
    }
}

export async function sendOrderReadyNotificationEmail(order: Order, customer: Customer) {
    try {
        if (!order.short_id || !customer.first_name) {
            throw new Error('Missing required fields for order ready notification email');
        }

        const { data, error } = await resend.emails.send({
            from: 'orders@resend.dev',
            to: customer.email as string,
            subject: `Order Ready: Your order #${order.short_id} is ready for pickup`,
            react: OrderReadyNotificationEmail({
                order: {
                    short_id: order.short_id,
                    total: order.total || 0
                },
                customer: {
                    first_name: customer.first_name
                }
            }),
        });

        if (error) {
            console.error('Failed to send order ready notification:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending order ready notification:', error);
        return { success: false, error };
    }
}