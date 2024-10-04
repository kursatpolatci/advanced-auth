import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

import { connectDB } from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.route.js"

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000", credentials: true}))

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`)
    connectDB();
})