import express from "express"

import { forgotPassword, login, logout, resetPassword, signup, verifyEmail } from "../controller/auth.controller.js"

const router = express.Router();

router.post("/signup", signup)
router.post("/verify-email", verifyEmail)
router.post("/logout", logout)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router;