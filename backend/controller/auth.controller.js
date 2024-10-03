import bcryptjs from "bcryptjs"

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({success: false, message: "All fields are required"})
        }

        const userAlreadyExists = await User.findOne({email})
        if (userAlreadyExists) {
            return res.status(400).json({success: false, message: "User already exists"})
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
        })

        generateTokenAndSetCookie(res, user._id)

        await sendVerificationEmail(email, verificationToken)

        await user.save();
        
        res.status(201).json({
            success:true,
            message: "User created successfully",
            data: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(`Error in signup controller: ${error.message}`)
        res.status(400).json({success: false, message: error.message})
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;

        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await sendWelcomeEmail(user.email, user.name);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(`Error in verifyEmail controller: ${error.message}`)
        res.status(400).json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({success: true, message: "Logget out successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}