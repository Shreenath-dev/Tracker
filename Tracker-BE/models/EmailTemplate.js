import mongoose from "mongoose";
import { Status } from "@/constants/enum";

const emailTemplateSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Status,
        default: "active"
    }
}, { timestamps: true });

const EmailTemplate = mongoose.model("emailTemplate", emailTemplateSchema, "emailTemplate");
export default EmailTemplate;