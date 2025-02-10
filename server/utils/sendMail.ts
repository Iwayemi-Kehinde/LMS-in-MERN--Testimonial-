require("dotenv").config()
import nodemailer, { Transporter } from "nodemailer"

const sendActivationMail = async (name: string, email: string, activationCode: string) => {
  const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })

  const mailOptions = {
    from: `"LMS APP" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Activate your account",
    html: `
          <div style="padding: 20px; border: 2px solid #4CAF50; text-align: center;">
        <h2 style="color: #333;">Welcome, ${name}!</h2>
        <p style="color: #666;">${activationCode}</p>
      </div>
    `
  }
  await transporter.sendMail(mailOptions)
}


export default sendActivationMail