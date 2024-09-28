import express from "express"
import dotenv from "dotenv"

import { connectDB } from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.route.js"

const app = express();

dotenv.config();

const PORT = process.env.PORT || 6000

app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`)
    connectDB();
})