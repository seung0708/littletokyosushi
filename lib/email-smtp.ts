import OrderConfirmationEmail from '@/emails/order-confirmation';
import PrepTimeNotificationEmail from '@/emails/prep-time-notifications';
import OrderReadyNotificationEmail from '@/emails/order-ready-notification';
import OrderCompletedEmail from '@/emails/order-completed-notifications';
import RefundNotificationEmail from '@/emails/refund-notificatons';
import StoreOrderNotificationEmail from '@/emails/store-order-notification';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { Order } from '@/types/order';
import { Customer } from '@/types/customer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'littletokyosushiinc@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  },
  secure: true,
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const result = await transporter.sendMail({
      from: 'Little Tokyo Sushi <littletokyosushiinc@gmail.com>',
      to,
      subject,
      html
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(order: Order, customer: Customer) {
  const emailHtml = await render(OrderConfirmationEmail({ order, customer }));
  return sendEmail(
    order.customers.email || customer.signinEmail || customer.guestEmail as string,
    `Order Confirmation #${order.short_id?.toUpperCase()}`,
    emailHtml
  );
}

export async function sendPrepTimeNotificationEmail(order: Order, customer: Customer) {

  if (!order.short_id || !order.prep_time_minutes || !customer.first_name) {
    throw new Error('Missing required fields for prep time notification email');
  }

  const emailHtml = await render(PrepTimeNotificationEmail({
    order: {
      short_id: order.short_id,
      prep_time_minutes: order.prep_time_minutes
    },
    customer: {
      first_name: customer.first_name
    }
  }));

  return sendEmail(
    customer.email as string,
    `Order Update: Your order #${order.short_id?.toUpperCase()} is being prepared`,
    emailHtml
  );
}

export async function sendOrderReadyNotificationEmail(order: Order, customer: Customer) {
  if (!order.short_id || !customer.first_name) {
    throw new Error('Missing required fields for order ready notification email');
  }

  const emailHtml = await render(OrderReadyNotificationEmail({
    order: {
      short_id: order.short_id,
      total: order.total || 0
    },
    customer: {
      first_name: customer.first_name
    }
  }));

  return sendEmail(
    customer.email as string,
    `Order Ready: Your order #${order.short_id?.toUpperCase()} is ready for pickup`,
    emailHtml
  );
}

export async function sendOrderCompletedEmail(order: Order, customer: Customer) {
  if (!order.short_id || !customer.first_name) {
    throw new Error('Missing required fields for order completed email');
  }

  const emailHtml = await render(OrderCompletedEmail({ order, customer }));
  return sendEmail(
    customer.email as string,
    `Order #${order.short_id?.toUpperCase()} Completed - Little Tokyo Sushi`,
    emailHtml
  );        
}

export async function sendRefundNotificationEmail(order: Order, customer: Customer, refundAmount: number) {
  const emailHtml = await render(RefundNotificationEmail({ order, customer, refundAmount }));
  return sendEmail(
    customer.email as string,
    `Refund Processed for Order #${order.short_id?.toUpperCase()} - Little Tokyo Sushi`,
    emailHtml
  );
}

export async function sendStoreOrderNotificationEmail(order: Order, customer: Customer) {
  const emailHtml = await render(StoreOrderNotificationEmail({ order, customer }));
  return sendEmail(
    'littletokyosushiinc@gmail.com', 
    `New Order #${order.short_id?.toUpperCase()} - $${order.total.toFixed(2)}`,
    emailHtml
  );
}