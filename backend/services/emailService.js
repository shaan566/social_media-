import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
  const emailDisabledEnvironments = ["stage"];

  if (emailDisabledEnvironments.includes(process.env.NODE_ENV)) {
    console.log(`📧 [Email Skipped] Environment: ${process.env.NODE_ENV}`);
    console.log(`   Recipient: ${options.email}`);
    console.log(`   Subject: ${options.subject}`);

    return {
      success: true,
      skipped: true,
      reason: `Email sending disabled in ${process.env.NODE_ENV} environment`,
      messageId: "skipped-non-production",
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("Email service not configured. Skipping email sending.");
    console.warn("Missing env variable: RESEND_API_KEY");

    return {
      success: false,
      message: "Email service not configured",
      skipped: true,
    };
  }

  try {
    const result = await resend.emails.send({
      from: "Social Media App <onboarding@resend.dev>", // ← free default, no domain needed
      to: options.email,
      subject: options.subject,
      html: options.message,
      attachments: Array.isArray(options.attachments) ? options.attachments : [],
    });

    console.log("✅ [Email Service] Email sent successfully:");
    console.log(`   To: ${options.email}`);
    console.log(`   Subject: ${options.subject}`);
    console.log(`   Message ID: ${result.data?.id}`);

    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", {
      error: error.message,
      to: options.email,
      subject: options.subject,
    });
    throw error;
  }
};