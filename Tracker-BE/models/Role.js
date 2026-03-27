import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
    {
        roleName: {
            type: String,
            required: true,
            unique: true
        },
        organisationId: {
            type: mongoose.Types.ObjectId,
            default: null
        },  
        createdBy: {
            type: mongoose.Types.ObjectId,  
            default: null
        },
        policyId: {
            type: mongoose.Types.ObjectId,
            ref: "permission",
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        }

    },
    { timestamps: true }
);

const Role = mongoose.model("role", RoleSchema, "role");
export default Role;