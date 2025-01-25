import OrderConfirmationEmail from '@/emails/order-confirmation';
import PrepTimeNotificationEmail from '@/emails/prep-time-notifications';
import OrderReadyNotificationEmail from '@/emails/order-ready-notification';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'littletokyosushiinc@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  },
  secure: true, // Use SSL
  tls: {
    rejectUnauthorized: false // Accept self-signed certs
  }
});

export async function sendOrderConfirmationEmail(order: any, customer: any) {
  try {
    // Wait for the HTML to be rendered
    const emailHtml = await render(OrderConfirmationEmail({ order, customer }));
    
    const result = await transporter.sendMail({
      from: 'Little Tokyo Sushi <littletokyosushiinc@gmail.com>',
      to: customer.email,
      subject: `Order Confirmation #${order.id.substring(0, 8)}`,
      html: emailHtml
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendPrepTimeNotificationEmail(order: any, customer: any) {
  try {
      const emailHTML = await render(PrepTimeNotificationEmail({ order, customer }));

      const result = await transporter.sendMail({
        from: 'Little Tokyo Sushi <littletokyosushiinc@gmail.com>',
        to: customer.email,
        subject: `Order Update: Your order #${order.id.substring(0, 8)} is being prepared`,
        html: emailHTML
      });
      
      return { success: true, data: result };
  } catch (error) {
      console.error('Error sending prep time notification:', error);
      return { success: false, error };
  }
}

export async function sendOrderReadyNotificationEmail(order: any, customer: any) {
  try {
      const emailHTML = await render(OrderReadyNotificationEmail({ order, customer }));

      const result = await transporter.sendMail({
        from: 'Little Tokyo Sushi <littletokyosushiinc@gmail.com>',
        to: customer.email,
        subject: `Your order #${order.short_id} is ready for pickup! 🍣`,
        html: emailHTML
      });
      
      return { success: true, data: result };
  } catch (error) {
      console.error('Error sending ready notification:', error);
      return { success: false, error };
  }
}