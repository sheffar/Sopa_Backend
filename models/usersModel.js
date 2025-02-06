import mongoose from "mongoose"


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        levelinschool: {
            type: String,
            required: true
        },
        lodgename: {
            type: String,
            required: true,
            lowercase: true,
        },
        phonenumber: {
            type: String,
            required: true,
        },
        courseofstudy: {
            type: String,
            required: true,
            lowercase: true,

        },
        dcg: {
            type: String,
            required: true,
            lowercase: true,

        },
        day: {
            type: String,
            required: true,
            lowercase: true,
        },
        month: {
            type: String,
            required: true,
            lowercase: true,
        },
        stateoforigin: {
            type: String,
            required: true,
            lowercase: true
        },
        gender: {
            type: String,
            required: true,
            lowercase: true,
        },
        area: {
            type: String,
            required: true
        }

    },
    { timestamps: true },

);

export const User = mongoose.model("User", userSchema);






