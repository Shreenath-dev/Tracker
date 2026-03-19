import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        passwords:{
            type: String,
            required: true
        }

    },
    { timestamps: true }
);

const User = mongoose.model("user", UserSchema, "user");
export default User;