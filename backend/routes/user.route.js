import express from "express"

import { deleteAccount } from "../controller/user.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.delete("/delete", verifyToken, deleteAccount)

export default router