import { Attendance } from "../models/AttendanceModel.js";
import { User } from "../models/usersModel.js";

function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}


//Get absentees function

export const absentees = async (req, res) => {
    const { weeknumber } = req.query;


    // Check if weeknumber is defined and is a valid number
    if (!weeknumber || isNaN(weeknumber)) {
        return res.status(400).json({ message: "Invalid week number" });
    }


    const currentDate = new Date();
    const lastWeekNumber = getWeekNumber(currentDate) - 1;



    try {
        //Get last week number 
        const lastSundayAttandance = await Attendance.find({
            week: lastWeekNumber
        }).populate('userId');

        console.log("the attendance for last week", lastSundayAttandance)
        //Get attandace for the current week
        const thisWeekAttendance = await Attendance.find({
            week: weeknumber
        }).populate('userId');




        if (lastSundayAttandance.length === 0) return res.status(400).json({ message: "No records were submitted last sunday, so i can't find absentees" })

        if (thisWeekAttendance.length === 0) return res.status(400).json({ message: "No records have been submitted this week" })

        // Extract userIds for both weeks
        const lastWeekUserIds = new Set(lastSundayAttandance.map(record => record.userId._id.toString()));
        const thisWeekUserIds = new Set(thisWeekAttendance.map(record => record.userId._id.toString()));

        // Find absentees: users present last week but absent this week
        const absentees = Array.from(lastWeekUserIds).filter(userId => !thisWeekUserIds.has(userId));


        // Fetch user details for absentees
        const absenteeDetails = await User.find({ _id: { $in: absentees } });

        return res.status(200).json(absenteeDetails);


    } catch (error) {
        console.log("Error occured", error.message)
        return res.status(500).json({ message: "Server error" })

    }
}