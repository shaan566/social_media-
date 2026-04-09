

// utils/emailTemplates.js

export const generateOtpEmail = (email, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="margin:0; padding:0; background-color:#0f0f1a; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a; padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#1a1a2e; border-radius:16px; padding:36px;">
              <tr>
                <td>
                  <div style="background-color:#6c63ff; border-radius:12px; width:56px; height:56px; text-align:center; margin-bottom:24px;">
                    <span style="color:#fff; font-size:20px; font-weight:bold; line-height:56px;">SM</span>
                  </div>
                  <h2 style="color:#fff; font-size:24px; font-weight:600; margin:0 0 16px;">Verify your email</h2>
                  <p style="color:#aaa; font-size:14px; line-height:1.6; margin:0 0 4px;">We need to verify your email address</p>
                  <p style="color:#7b7fff; font-size:14px; margin:0 0 4px;">${email}</p>
                  <p style="color:#aaa; font-size:14px; line-height:1.6; margin:0 0 24px;">before you can access your account. Enter the code below in your open browser window.</p>
                  <p style="color:#fff; font-size:44px; font-weight:600; letter-spacing:6px; margin:0 0 24px;">${otp}</p>
                  <hr style="border:none; border-top:1px solid rgba(255,255,255,0.1); margin:0 0 16px;" />
                  <p style="color:#888; font-size:12px; margin:0 0 12px;">This code expires in 10 minutes.</p>
                  <p style="color:#888; font-size:12px; line-height:1.6; margin:0;">If you didn't sign up for Social media app, you can safely ignore this email.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};