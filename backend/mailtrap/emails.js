import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const recipient = [{email}]

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken),
            category: "Email Verification"
        })

        console.log("Verification Email sent successfully", response);
    } catch (error) {
        console.error("Error sending verification", error)
        throw new Error(`Error sending verification email: ${error}`)
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
        console.error("Error sending verification", error)
        throw new Error(`Error sending verification email: ${error}`)
    }
}