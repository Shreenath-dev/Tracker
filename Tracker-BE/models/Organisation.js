import mongoose from "mongoose";

const OrganisationSchema = new mongoose.Schema({
    organisationName: {
        type: String,
        required: true
    },
    organisationOwner: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    organisationImage: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
    { timestamps: true }
)

const Organisation = mongoose.model("organisation", OrganisationSchema, "organisation");
export default Organisation;