import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            default:""
        },
        email: {
            type: String,
            required: true
        },
        password:{
            type: String,
            default:""
        },
        passwordUpdatedAt: {
            type: Date,
            default:null
        },
        organisationId: {
            type: mongoose.Types.ObjectId,
            default: null
        },
        profilePicture: {
            type: String,
            default: "",
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        role:{
            type:String,
            enum: ["admin", "manager", "agent"],
            default:"admin"
        }

    },
    { timestamps: true }
);

const User = mongoose.model("user", UserSchema, "user");
export default User;