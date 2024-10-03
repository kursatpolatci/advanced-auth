import express from "express"

import { signup, verifyEmail } from "../controller/auth.controller.js"

const router = express.Router();

router.post("/signup", signup)
router.post("/verify-email", verifyEmail)

export default router;