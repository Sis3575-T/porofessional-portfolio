export async function sendContactNotification({ name, email, subject, message }) {
  console.log("[CONTACT] Message stored in database — no email sent to admin");
  return false;
}

export async function sendReplyToUser({ to, name, subject, reply }) {
  console.log(`[EMAIL] Sending reply to ${to}`);
  console.log("[EMAIL] SMTP_HOST:", process.env.SMTP_HOST);
  console.log("[EMAIL] SMTP_USER:", process.env.SMTP_USER);
  console.log("[EMAIL] SMTP_PORT:", process.env.SMTP_PORT);
  console.log("[EMAIL] SMTP_PASS length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (!smtpConfigured) {
    console.log("[EMAIL] SMTP not configured — reply saved in database only");
    return false;
  }

  try {
    let nodemailer;
    try {
      nodemailer = (await import("nodemailer")).default;
    } catch {
      console.error("[EMAIL] nodemailer module not found — run 'npm install' to install it");
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
      debug: true,
    });

    await transporter.verify();
    console.log("[EMAIL] SMTP connection verified successfully");

    const info = await transporter.sendMail({
      from: `"${process.env.SITE_NAME || "Portfolio"}" <${process.env.SMTP_USER}>`,
      to,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reply to your message</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out. Here is my reply:</p>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="white-space: pre-wrap; color: #333;">${reply}</p>
          </div>
          <p style="color: #666; font-size: 14px;">Best regards</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">This is a reply to your message: ${subject}</p>
        </div>
      `,
    });
    console.log("[EMAIL] Reply sent successfully to", to, "| messageId:", info.messageId);
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send reply:", error);
    return false;
  }
}
