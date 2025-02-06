import mongoose from "mongoose";

const AttandanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    week: {
        type: String,
    }
}, {
    timestamps: true
})  

export const Attendance = mongoose.model("Attandance", AttandanceSchema);
 