import { Attendance } from "../models/AttendanceModel.js";

export const weeekAttedance = async (req, res) => {
    const { weeknumber } = req.query;

    try {
        const user = await Attendance.find({ week: weeknumber }).populate("userId")

        if (user.length === 0) return res.status(400).json({ message: `No records were submitted in week ${weeknumber}` })

        return res.status(200).json(user)


    } catch (error) {
        return res.status(500).json({ message: "Server Error" })
    }
}  