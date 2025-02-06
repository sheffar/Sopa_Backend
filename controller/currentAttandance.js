import { Attendance } from "../models/AttendanceModel.js";


//Get all users created for that current day 
export const currentUsers = async (req, res) => {



    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    try {
        const users = await Attendance.find({

            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).populate("userId")

        if (users.length === 0) return res.status(400).json("No user have been recorded today")

        return res.status(200).json(users)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Server error occurred please try again" })
    }

}
