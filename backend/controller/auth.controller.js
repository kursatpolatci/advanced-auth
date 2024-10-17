import bcryptjs from "bcryptjs"
import crypto from "crypto"

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../email/emails.js";

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
            user: {
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
        console.log(`Error in logout controller: ${error.message}`)
        res.status(400).json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();

        await user.save()

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(`Error in login controller: ${error.message}`)
        res.status(400).json({success: false, message: error.message})
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }

        user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordTokenExpiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${user.resetPasswordToken}`)
        
        await user.save();

        res.status(200).json({success: true, message: "Password reset link sent to your email"})
    } catch (error) {
        console.log(`Error in forgotPassword controller: ${error.message}`)
        res.status(400).json({success: false, message: error.message})
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: {$gt: Date.now()}
        })

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired reset token"})
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;

        await sendResetSuccessEmail(user.email);

        await user.save();

        res.status(200).json({success: true, message: "Password reset successfully"})
    } catch (error) {
        console.log(`Error in resetPassword controller: ${error.message}`)
        res.status(400).json({success: false, message: error.message})
    }
}

export const checkAuth = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined
            } 
        })
    } catch (error) {
        console.log(`Error in checkAuth controller: ${error.message}`)
        res.status(400).json({success: false, message: error.message})
    }
}