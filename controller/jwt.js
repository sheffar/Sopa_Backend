import jwt from "jsonwebtoken"

export const JwtValidation = async (req, res, next)=>{
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {

            console.log(`Token verification failed: ${err.message}`);

            return res.status(403).json({ message: "Invalid Token" });
        } 
        req.user = user; 
        next();
    });
}