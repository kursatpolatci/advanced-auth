import { User } from "../models/user.model.js"

import { sendDeleteSuccessEmail } from "../email/emails.js"

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId

        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }

        await sendDeleteSuccessEmail(user.email);
        res.clearCookie("token") 
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error) {
        console.log(`Error in deleteAccount controller: ${error.message}`)
        res.status(400).json({success: false, message: error.message})
    }
}