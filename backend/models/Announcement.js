const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        enum: ["General", "Mess", "Payment", "Maintenance", "Emergency", "Event"],
        default: "General"
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },

    audience: {
        type: String,
        enum: ["All", "Girls Hostel", "Boys Hostel", "Selected Room"],
        required: true
    },

    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft"
    },

    pin: {
        type: Boolean,
        default: false
    },

    notify: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Announcement", announcementSchema);