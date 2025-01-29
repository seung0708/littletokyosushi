// lib/email-smtp.ts
import OrderConfirmationEmail from '@/emails/order-confirmation';
import PrepTimeNotificationEmail from '@/emails/prep-time-notifications';
import OrderReadyNotificationEmail from '@/emails/order-ready-notification';
import OrderCompletedEmail from '@/emails/order-completed-notifications';
import RefundNotificationEmail from '@/emails/refund-notificatons';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

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

export async function sendOrderConfirmationEmail(order: any, customer: any) {
  const emailHtml = await render(OrderConfirmationEmail({ order, customer }));
  return sendEmail(
    customer.email,
    `Order Confirmation #${order.short_id}`,
    emailHtml
  );
}

export async function sendPrepTimeNotificationEmail(order: any, customer: any) {
  const emailHtml = await render(PrepTimeNotificationEmail({ order, customer }));
  return sendEmail(
    customer.email,
    `Order Update: Your order #${order.short_id} is being prepared`,
    emailHtml
  );
}

export async function sendOrderReadyNotificationEmail(order: any, customer: any) {
  const emailHtml = await render(OrderReadyNotificationEmail({ order, customer }));
  return sendEmail(
    customer.email,
    `Order Ready: Your order #${order.short_id} is ready for pickup`,
    emailHtml
  );
}

export async function sendOrderCompletedEmail(order: any, customer: any) {
  const emailHtml = await render(OrderCompletedEmail({ order, customer }));
  return sendEmail(
    customer.email,
    `Order #${order.short_id} Completed - Little Tokyo Sushi`,
    emailHtml
  );
}

export async function sendRefundNotificationEmail(order: any, customer: any, refundAmount: number) {
  const emailHtml = await render(RefundNotificationEmail({ order, customer, refundAmount }));
  return sendEmail(
    customer.email,
    `Refund Processed for Order #${order.short_id} - Little Tokyo Sushi`,
    emailHtml
  );
}