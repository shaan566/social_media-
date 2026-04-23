// import { Resend } from "resend";
// import dotenv from "dotenv";

// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendEmail = async (options) => {
//   const emailDisabledEnvironments = ["stage"];

//   if (emailDisabledEnvironments.includes(process.env.NODE_ENV)) {
//     console.log(`📧 [Email Skipped] Environment: ${process.env.NODE_ENV}`);
//     console.log(`   Recipient: ${options.email}`);
//     console.log(`   Subject: ${options.subject}`);

//     return {
//       success: true,
//       skipped: true,
//       reason: `Email sending disabled in ${process.env.NODE_ENV} environment`,
//       messageId: "skipped-non-production",
//     };
//   }

//   if (!process.env.RESEND_API_KEY) {
//     console.warn("Email service not configured. Skipping email sending.");
//     console.warn("Missing env variable: RESEND_API_KEY");

//     return {
//       success: false,
//       message: "Email service not configured",
//       skipped: true,
//     };
//   }

//   try {
//     const result = await resend.emails.send({
//       from: "Schedly <onboarding@resend.dev>", // ← free default, no domain needed
//       to: options.email,
//       subject: options.subject,
//       html: options.message,
//       attachments: Array.isArray(options.attachments) ? options.attachments : [],
//     });

//     console.log("✅ [Email Service] Email sent successfully:");
//     console.log(`   To: ${options.email}`);
//     console.log(`   Subject: ${options.subject}`);
//     console.log(`   Message ID: ${result.data?.id}`);

//     return result;
//   } catch (error) {
//     console.error("❌ Email sending failed:", {
//       error: error.message,
//       to: options.email,
//       subject: options.subject,
//     });
//     throw error;
//   }
// };


import nodemailer from "nodemailer"

/**
 * Core sendEmail (now supports attachments)
 * Uses Gmail App Password - works on Render (no SMTP port issues)
 */
export const sendEmail = async (options) => {
  const emailDisabledEnvironments = ["stage"]

  if (emailDisabledEnvironments.includes(process.env.NODE_ENV)) {
    console.log(`📧 [Email Skipped] Environment: ${process.env.NODE_ENV}`)
    console.log(`   Recipient: ${options.email}`)
    console.log(`   Subject: ${options.subject}`)
    return {
      success: true,
      skipped: true,
      reason: `Email sending disabled in ${process.env.NODE_ENV} environment`,
      messageId: "skipped-non-production",
    }
  }

  // ✅ Changed: Only need EMAIL_USER and EMAIL_PASS (no SMTP_HOST needed)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ Email service not configured. Missing EMAIL_USER or EMAIL_PASS")

    // if (process.env.NODE_ENV === "development") {
    //   const testAccount = await createTestAccount()
    //   if (testAccount) {
    //     return sendEmailWithTestAccount(options, testAccount)
    //   }
    // }

    return {
      success: false,
      message: "Email service not configured",
      skipped: true,
    }
  }

  try {
    // ✅ KEY FIX: Use `service: "gmail"` instead of host/port
    // This avoids Render's SMTP port blocking entirely
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // your Gmail address
        pass: process.env.EMAIL_PASS,  // 16-char App Password (NOT your Gmail password)
      },
    })

    await transporter.verify()

    const mailOptions = {
      from: `Schedly <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
      attachments: Array.isArray(options.attachments) ? options.attachments : [],
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        Importance: "normal",
      },
    }

    const result = await transporter.sendMail(mailOptions)

    console.log("✅ [Email Service] Email sent successfully:")
    console.log(`   To: ${options.email}`)
    console.log(`   Subject: ${options.subject}`)
    console.log(`   Message ID: ${result.messageId}`)
    console.log(`   Response: ${result.response}`)

    return result
  } catch (error) {
    console.error("❌ Email sending failed:", {
      error: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
      to: options.email,
      subject: options.subject,
    })

    // if (error.code === "EAUTH" && process.env.NODE_ENV === "development") {
    //   const testAccount = await createTestAccount()
    //   if (testAccount) {
    //     return sendEmailWithTestAccount(options, testAccount)
    //   }
    // }
    throw error
  }
}