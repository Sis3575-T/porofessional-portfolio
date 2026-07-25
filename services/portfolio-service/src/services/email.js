export async function sendContactNotification({ name, email, subject, message }) {
  console.log(`[EMAIL] New contact from ${name} (${email})`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Message: ${message.substring(0, 200)}...`);

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
      console.log("[EMAIL] Notification sent successfully");
    } catch (error) {
      console.error("[EMAIL] Failed to send:", error.message);
    }
  }
}

export async function sendReplyToUser({ to, name, subject, reply }) {
  console.log(`[EMAIL] Sending reply to ${to} regarding: ${subject}`);

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("[EMAIL] SMTP not configured, skipping reply email");
    return false;
  }

  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.SITE_NAME || 'Portfolio'}" <${process.env.SMTP_USER}>`,
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
          <p style="color: #999; font-size: 12px;">This is a reply to your message regarding: ${subject}</p>
        </div>
      `,
    });
    console.log("[EMAIL] Reply sent successfully to", to);
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send reply:", error.message);
    return false;
  }
}
