import { User } from "../models/usersModel.js";

export const EditUserInfo = async (req, res) => {

    const { payload } = req.body; // Get the payload containing the fields to update
    const userId = req.params.id; // Assuming the user ID is passed in the route parameter

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Validate if payload exists and is an object
        if (!payload || typeof payload !== "object") {
            return res.status(400).json({ message: "Invalid payload" });
        }

        // Update user information dynamically using the $set operator
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: payload },
            { new: true, runValidators: true } // Return the updated document and run schema validation
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User information updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Server Error Occurred:", error.message);
        return res.status(500).json({ message: "Server Error Occurred" });
    }
};
