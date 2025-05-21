// lib/mail.ts
import nodemailer from "nodemailer";

// Configure Nodemailer transporter
export const transporter = nodemailer.createTransport({
  service: "gmail",  // Use the service name instead of host/port
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD, // This should be an app password
  },
  // For debugging
  logger: true,
  debug: true
});

// Test the connection on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send messages");
  }
});

// Email template for OTP verification
export async function sendOTPEmail(to, otp, name) {
  console.log("Attempting to send email to:", to);
  console.log("Using credentials:", {
    user: process.env.EMAIL_SERVER_USER,
    from: process.env.EMAIL_FROM_ADDRESS
  });
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_SERVER_USER}>`, // Use actual email as FROM
    to,
    subject: 'Your Verification Code',
    text: `Hello ${name},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nThank you,\nYour App Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Please use the following code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 12px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <p>Thank you,<br>Online Home Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error('Detailed error sending OTP email:', error);
    return { success: false, error };
  }
}