import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MONGO_URI: ${process.env.MONGO_URI}`)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connection to mongoDB: ${error.mongoose}`)
        process.exit(1);
    }
}