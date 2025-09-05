import nodemailer from "nodemailer"
import { env } from "@/data/env/server"

interface SendPasswordResetEmailParams {
    to: string
    resetToken: string
}

export async function sendPasswordResetEmail({ to, resetToken }: SendPasswordResetEmailParams) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
        },
    })

    const baseUrl = env.OAUTH_REDIRECT_URL_BASE.replace(/\/$/, "")
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    const mailOptions = {
        from: env.EMAIL_USER,
        to,
        subject: "Reset Your Password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #666; font-size: 12px;">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
} 