import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-smtp';

export async function POST(request: Request) {
  try {
    const { email, subject, message } = await request.json();

    const htmlContent = `
      <h2>Contact Form Submission</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p>${message}</p>
    `;

    const result = await sendEmail(
      'littletokyosushiinc@gmail.com',
      `Contact Form: ${subject}`,
      htmlContent
    );

    if (result.success) {
      return NextResponse.json({ message: 'Email sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
