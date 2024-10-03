import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({success: false, messsage: "Unautherized - No token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({success: false, messsage: "Unautherized - Invalid token"})
        }

        req.userId = decoded.userId
        next();
    } catch (error) {
        console.log(`Error in verifyToken middleware: ${error.message}`)
        return res.status(500).json({success: false, message: "Server Error"})
    }
}