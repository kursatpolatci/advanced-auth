import express from "express"

import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } from "../controller/auth.controller.js"
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/verify-email", verifyEmail)
router.post("/logout", logout)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

router.get("/check-auth", verifyToken, checkAuth)

export default router;