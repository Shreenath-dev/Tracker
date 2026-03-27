import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    organisationId: {
        type: mongoose.Types.ObjectId,
        ref: "organisation",
        required: true
    },
    policyName: {
        type: String,
        required: true
    },
    viewTicket: {
        type: Boolean,
        default: false
    },
    createTicket: {
        type: Boolean,
        default: false
    },
    editTicket: {
        type: Boolean,
        default: false
    },
    deleteTicket: {
        type: Boolean,
        default: false
    },
    assignTicketToSelf: {
        type: Boolean,
        default: false
    },
    assignTicketToAnyone: {
        type: Boolean,
        default: false
    },
    changeTicketStatus: {
        type: Boolean,
        default: false
    },
    changeTicketPriority: {
        type: Boolean,
        default: false
    },
    replyTicket: {
        type: Boolean,
        default: false
    },
    addInternalNote: {
        type: Boolean,
        default: false
    },
    bulkActionTicket: {
        type: Boolean,
        default: false
    },

    // ── CONTACTS ─────────────────────────────────────────────────────────────
    viewContact: {
        type: Boolean,
        default: false
    },
    createContact: {
        type: Boolean,
        default: false
    },
    editContact: {
        type: Boolean,
        default: false
    },
    deleteContact: {
        type: Boolean,
        default: false
    },

    // ── TEAM ─────────────────────────────────────────────────────────────────
    viewTeam: {
        type: Boolean,
        default: false
    },
    inviteMember: {
        type: Boolean,
        default: false
    },
    removeMember: {
        type: Boolean,
        default: false
    },
    changeMemberRole: {
        type: Boolean,
        default: false
    },
    manageRoles: {
        type: Boolean,
        default: false
    },
    manageTeams: {
        type: Boolean,
        default: false
    },

    // ── REPORTS ──────────────────────────────────────────────────────────────
    viewOwnReports: {
        type: Boolean,
        default: false
    },
    viewTeamReports: {
        type: Boolean,
        default: false
    },
    viewOrgReports: {
        type: Boolean,
        default: false
    },

    viewIntegrations: {
        type: Boolean,
        default: false
    },
    manageIntegrations: {
        type: Boolean,
        default: false
    },

    editOwnProfile: {
        type: Boolean,
        default: false
    },
    editOrganisationSettings: {
        type: Boolean,
        default: false
    },
    manageBilling: {
        type: Boolean,
        default: false
    },
    manageCustomFields: {
        type: Boolean,
        default: false
    },
    viewAuditLog: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
);

PermissionSchema.index({ roleId: 1, organisationId: 1 }, { unique: true });

const Permission = mongoose.model("permission", PermissionSchema, "permission");
export default Permission;