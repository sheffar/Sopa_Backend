
import { Attendance } from "../models/AttendanceModel.js";
import { User } from "../models/usersModel.js"

function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}
const currentDate = new Date();
// const weekNumber = getWeekNumber(currentDate);
let weekNumber


const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);


let findPhoneNumber


export const SignAttendance = async (req, res) => {
    const { phonenumber, weeknumber } = req.body

    console.log("the week number for phine bumber", weeknumber)
    //check if week number is present 
    weekNumber = weeknumber ? getWeekNumber(currentDate) - weeknumber : getWeekNumber(currentDate)


    try {

        findPhoneNumber = await User.findOne({ phonenumber: { $regex: phonenumber, $options: "i" } })

        if (findPhoneNumber) {//here checks if the phoneNumber is in the database


            // Check if the user has already been marked present today
            const checkAttendance = await Attendance.findOne({
                userId: findPhoneNumber._id,

                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });


            if (checkAttendance) {// If the user has been marked present, throw an error
                console.log(checkAttendance)

                return res.status(400).json({ message: `${findPhoneNumber.username} is already present for today` })

            } else {


                signUser()// call the take user function if the user phone number exist

                return res.status(200).json({ message: `${findPhoneNumber.username} is now present for today` });

            }
        } else {
            return res.status(400).json({ message: "Please add new attendant" })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Server Error" })
    }


}

export const signUser = async (req, res) => {
    try {
        // take new attendance for the user
        await Attendance.create({
            week: `${weekNumber}`,
            userId: findPhoneNumber._id
        })

    } catch (error) {
        return res.status(500).json({ message: "Error occurred while trying to take user attendance" })

    }
}