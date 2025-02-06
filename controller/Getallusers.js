import { Attendance } from "../models/AttendanceModel.js"
import { User } from "../models/usersModel.js"

//Get all users in the db 
export const allUsers = async (req, res) => {

    try {
        const user = await User.find()

        if (user.length === 0) return res.status(400).json({ message: "No user found" })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}

export const FindUserById = async (req, res) => {
    const userId = req.params.id; // Assuming the user ID is passed in the route parameter

    try {
        const user = await User.findById({ _id: userId })

        if (!user) return res.status(400).json({ message: " User not found" })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}


export const deleteUser = async (req, res) => {
    const { id } = req.params; // Extract user ID from request parameters

    console.log(id) 

    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Find and delete the user by ID
        const deletedUser = await Attendance.findByIdAndDelete({ _id: id });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Server error occurred" });
    }
};
