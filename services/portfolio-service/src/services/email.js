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
