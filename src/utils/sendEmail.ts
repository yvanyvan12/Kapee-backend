import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a Nodemailer transporter
const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send Email
const mailerSender = async (
  to: string,
  subject: string,
  htmlContent: string,
  replyTo?: string  // Made optional with ?
): Promise<boolean> => {
  try {
    const mailOptions: SendMailOptions = {
      from: `"Kapee" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
      replyTo: replyTo || process.env.ADMIN_EMAIL,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
    return true;
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    return false;
  }
};

export default mailerSender;