import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { transporter } from "./email.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
            from: "polatcikursat58@gmail.com",
            to: email,
            subject: "Verification Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken),
        }

        const res = await transporter.sendMail(mailOptions)
        console.log("Verification Email sent successfully: ", res)
    } catch (error) {
        console.error("Error sending Verification Email", error)
        throw new Error(`Error sending Verification Email: ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: "polatcikursat58@gmail.com",
            to: email,
            subject: "Welcome Email",
            html: WELCOME_EMAIL_TEMPLATE
            .replace(/{name}/g, name)
            .replace("{project_name}", "Advanced Auth")
        }
        
        const res = await transporter.sendMail(mailOptions)
        console.log("Welcome Email sent successfully: ", res)
    } catch (error) {
        console.error("Error sending Welcome Email", error)
        throw new Error(`Error sending Welcome Email: ${error}`)
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const mailOptions = {
            from: "polatcikursat58@gmail.com",
            to: email,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)
        }

        const res = await transporter.sendMail(mailOptions)
        console.log("Password Reset Email sent successfully: ", res);
    } catch (error) {
        console.error(`Error sending Password Reset Email`, error)
        throw new Error(`Error sending Password Reset Email: ${error}`)
    }
}

export const sendResetSuccessEmail = async (email) => {
    try {
        const mailOptions = {
            from: "polatcikursat58@gmail.com",
            to: email,
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        }

        const res = await transporter.sendMail(mailOptions)
        console.log("Reset Success Email sent successfully: ", res)
    } catch (error) {
        console.error(`Error sending Password Reset Success Email`, error)
        throw new Error(`Error sending Password Reset Success Email: ${error}`)
    }
}