import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.route.js"

const app = express();

dotenv.config();

const PORT = process.env.PORT || 6000

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`)
    connectDB();
})