import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();


export const sendEmail = async (options) => {
  // Skip email sending in stage and demo environments only
  // console.log("📨 Checking email configuration...");
  // console.log("NODE_ENV:", process.env.NODE_ENV);
  // console.log("SMTP_HOST:", process.env.SMTP_HOST);
  // console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
  // console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");

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

  if (
    !process.env.SMTP_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    console.warn("Email service not configured. Skipping email sending.")
    console.warn("Missing env variables: SMTP_HOST, EMAIL_USER, or EMAIL_PASS")
    console.warn(
      "Please check the email setup guide: docs/email-setup-guide.md"
    )

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
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === "465",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: { rejectUnauthorized: false },
    })

    await transporter.verify()

    const mailOptions = {
      from: `Social Media app  <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
      attachments: Array.isArray(options.attachments)
        ? options.attachments
        : [],
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
