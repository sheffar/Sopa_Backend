
import { User } from "../models/usersModel.js";

export const searchForUser = async (req, res) => {
    const { username } = req.query

    if (!username) return res.status(400).json({ message: "Invalid username provided" });

    try {
        const user = await User.find({ username: { $regex: username, $options: "i" } })

        if (user.length === 0) return res.status(400).json({ message: "No user found" })

        return res.status(200).json(user)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Server Error Occurred" })

    }
}