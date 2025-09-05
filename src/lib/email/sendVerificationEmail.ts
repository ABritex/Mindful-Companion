import nodemailer from "nodemailer"
import { env } from "@/data/env/server"

export async function sendVerificationEmail({
    to,
    code,
}: {
    to: string
    code: string
}) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
        },
    })

    const mailOptions = {
        from: env.EMAIL_USER,
        to,
        subject: "Verify your email",
        html: `<p>Your verification code is:</p>
            <h2>${code}</h2>
            <p>This code will expire in 10 minutes.</p>`,
    }

    await transporter.sendMail(mailOptions)
}
