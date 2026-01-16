import 'dotenv/config';
import { Resend } from 'resend';

export type EmailParams = {
  to: string;
  subject: string;
  html: string;
};

let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || '');
  }
  return resendInstance;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  const resend = getResend();
  // Skip in unit test
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const isDev = process.env.NODE_ENV !== 'production';

  const { data, error } = await resend.emails.send({
    from: isDev ? 'Nihongo Lab <onboarding@resend.dev>' : process.env.EMAIL_FROM!,
    to: isDev ? (process.env.DEV_EMAIL ?? to) : to,
    subject,
    html
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
  return data;
}
