import { createTransport } from "nodemailer";

// Create a transporter using SMTP
const transporter = createTransport({
  host: "smtp.example.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});