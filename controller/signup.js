import jwt from "jsonwebtoken"
import { Signup } from "../models/SignupModel.js";


//Sign up function 
export const signup = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    

    let user; 

    try {//here checks if there is a registered user with the incoming username and email
        user = await Signup.findOne({
            $or: [
                { username },
                { email }
            ]
        })


        //Throw an error if there is an existing user with the credentials
        if (user) return res.status(400).json({ message: 'This user already exist' })


    } catch(e){
        console.log(e.message)
       return res.status(500).json({ message: " Error occured while checking for user" })
    }

    //Here checks if the incoming password is not the same as that in the dot env file
    if (password.trim() !== process.env.AdMIN_PASSWORD) {
        return res.status(400).json({ message: 'Accesss Denied, Only Authorised Admin Can Signup' })
    }

    try {
        await Signup.create({
            username,
            email,
            password: password,
        })

        const data = {
            username,
            email
        }

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" })
        res.cookie("token", token, { httpOnly: true }); 

        return res.status(200).json({ message: "Sign up successful" });


    } catch(e) {
        console.log(e.message)
       return res.status(400).json({ message: "Error occured while trying to signup" })
    }

};