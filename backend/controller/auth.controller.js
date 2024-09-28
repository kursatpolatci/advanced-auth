import bcryptjs from "bcryptjs"

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

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
            password,
            name,
            verificationToken,
            verificationTokenTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })

        generateTokenAndSetCookie(res, user._id)

        // TODO: Send Verification Email

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
        res.status(400).json({success: false, message: error.message})   
    }
}