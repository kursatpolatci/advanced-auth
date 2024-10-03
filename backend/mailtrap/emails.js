import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const recipient = [{email}]

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken),
            category: "Email Verification"
        })

        console.log("Verification Email sent successfully", response);
    } catch (error) {
        console.error("Error sending Verification Email", error)
        throw new Error(`Error sending Verification Email: ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        const recipient = [{email}]

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "ebeb5a33-66b6-48c2-8f3d-458d9474d165",
            template_variables: {
                name: name,
                company_info_name: "Advanced Auth"
            }
        })

        console.log("Welcome Email sent successfully", response);
    } catch (error) {
        console.error("Error sending Welcome Email", error)
        throw new Error(`Error sending Welcome Email: ${error}`)
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const recipient = [{email}]

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })

        console.log("Password Reset Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending Password Reset Email`, error)
        throw new Error(`Error sending Password Reset Email: ${error}`)
    }
}

export const sendResetSuccessEmail = async (email) => {
    try {
        const recipient = [{email}]

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        })
    } catch (error) {
        console.error(`Error sending Password Reset Success Email`, error)
        throw new Error(`Error sending Password Reset Success Email: ${error}`)
    }
}