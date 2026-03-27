import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
    {
        organisationId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        roleId: {
            type: mongoose.Types.ObjectId,
            ref: "role",
            required: true
        },
        policyId: {
            type: mongoose.Types.ObjectId,
            ref: "permission",
            required: true
        },
        email: {
            type: String,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        reportingTo: {
            type: mongoose.Types.ObjectId,
            default: null
        }
    },
    { timestamps: true }
);

const Employee = mongoose.model("employee", EmployeeSchema, "employee");
export default Employee;