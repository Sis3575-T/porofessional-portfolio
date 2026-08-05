import { Resend } from "resend";

let resend = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = "Portfolio <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sisay3575@gmail.com";

export async function sendContactNotification({ name, email, subject, message }) {
  const client = getResend();
  if (!client) {
    console.log("[EMAIL] Resend not configured — notification skipped");
    return false;
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact: ${subject || "No subject"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name</td><td style="padding: 8px;">${name || "Anonymous"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;">${email || "No email"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Subject</td><td style="padding: 8px;">${subject || "No subject"}</td></tr>
          </table>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="white-space: pre-wrap; color: #333; margin: 0;">${message}</p>
          </div>
          <p style="color: #999; font-size: 12px;">Reply from the admin dashboard to send an email response to the visitor.</p>
        </div>
      `,
    });
    console.log("[EMAIL] Admin notification sent for message from:", name || "Anonymous");
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send admin notification:", error.message);
    return false;
  }
}

export async function sendReplyToUser({ to, name, subject, reply }) {
  const client = getResend();
  if (!client) {
    console.log("[EMAIL] Resend not configured — reply saved in database only");
    return false;
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Re: ${subject || "Your message"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reply to your message</h2>
          <p>Hi ${name || "there"},</p>
          <p>Thank you for reaching out. Here is my reply:</p>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="white-space: pre-wrap; color: #333; margin: 0;">${reply}</p>
          </div>
          <p style="color: #666; font-size: 14px;">Best regards</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">This is a reply to your message: ${subject || "Your message"}</p>
        </div>
      `,
    });
    console.log("[EMAIL] Reply sent to:", to);
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send reply:", error.message);
    return false;
  }
}
