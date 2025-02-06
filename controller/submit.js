import { User } from "../models/usersModel.js"
import { Attendance } from "../models/AttendanceModel.js";

function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}



export const submitinfo = async (req, res) => {


    const { username, levelinschool, lodgename, phonenumber, courseofstudy, dcg, day, month, stateoforigin, gender, area, weeknumber } = req.body;

    if (!username || !levelinschool || !lodgename || !phonenumber || !courseofstudy || !dcg || !day || !month || !stateoforigin || !gender || !area) {
        return res.status(403).json({ message: "All input fields are required" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const CheckWeek = getWeekNumber(new Date());

    const currentWeekNumber = weeknumber ? getWeekNumber(new Date()) - weeknumber : getWeekNumber(new Date())



    let checkUser;


    try {
        // Check if the user exists in the database by phoneNumber
        checkUser = await User.findOne({ phonenumber })

        if (checkUser) {//here, it's assumed that a user exist with the incoming phone number

            //Below checks if the user has already been marked present today
            const checkAttendance = await Attendance.findOne({
                userId: checkUser._id,
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });


            if (checkAttendance) {//here, the user has been marked present for that day

                return res.status(400).json({ message: `${checkUser.username} is already present for today` })
            } else {
                //Mark attendance for user if not present for the day 
                await Attendance.create({
                    week: `${currentWeekNumber}`,
                    userId: checkUser._id
                });

                return res.status(200).json({ message: `${checkUser.username} is now present for today` })


            }


        } else {// if  the phone number is not found in the database


            // Check if there is a user with matching details (username, gender, state of origin )
            const matchingUser = await User.findOne({ username, stateoforigin, gender })

            if (matchingUser) {
                matchingUser.phonenumber = phonenumber;
                // matchingUser.level in school = // also update the user level in school
                await matchingUser.save();


                const checkAttendance = await Attendance.findOne({
                    week: `${currentWeekNumber}`,
                    userId: matchingUser._id,

                });
                console.log(`current week number is ${checkAttendance.week}`)

                if (parseInt(checkAttendance.week) === currentWeekNumber) {

                    return res.status(400).json({
                        message: `${matchingUser.username} details updated and is already present`
                    });

                } else {
                    await Attendance.create({
                        week: `${currentWeekNumber}`,
                        userId: matchingUser._id,

                    });


                    return res.status(200).json({
                        message: `Details updated for ${matchingUser.username}, and attendance marked`
                    });
                }

            } else {
                // If no matching user found, proceed with creating a new user
                const newUser = await User.create({
                    username,
                    levelinschool,
                    lodgename,
                    phonenumber,
                    courseofstudy,
                    dcg,
                    day,
                    month,
                    stateoforigin,
                    gender,
                    area
                });

                // Mark the new user present for today
                await Attendance.create({
                    week: `${currentWeekNumber}`,
                    userId: newUser._id
                });

                return res.status(200).json({ message: "New attendant added and marked present today" });

            }

        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Error occurred" })
    }
}



