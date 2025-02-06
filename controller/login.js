import { Signup } from "../models/SignupModel.js";
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }   

    try {
        const user = await Signup.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })

        if (!user) return res.status(400).json({ message: `The username ${username} do not exist` })

        if (password.trim() !== process.env.AdMIN_PASSWORD) {
            return res.status(400).json({ message: " Incorrect password" })
        }


        //sign a new jwt during log in 
        const data = {
            username,
            password
        };

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.cookie("token", token, { httpOnly: true,  secure: true });
        console.log("the cookie", token)

        return res.status(200).json({ message: " Login Successfull", token })

    } catch (e) {
        console.log(e.message)
       return res.status(500).json({message: "Server Error"})
    } 
}