import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/order-confirmation';
import PrepTimeNotificationEmail from '@/emails/prep-time-notifications';
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
        const { data, error } = await resend.emails.send({
            from: 'orders@resend.dev',
            to: customer.email as string,
            subject: `Order Update: Your order #${order.short_id} is being prepared`,
            react: PrepTimeNotificationEmail({
                order,
                customer,
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