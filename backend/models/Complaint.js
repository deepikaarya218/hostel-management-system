const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    studentName:{
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true
    },
    complaint: {
        type: String,
        enum: ["Plumbing", "Electricity", "Cleanliness", "Food", "Furniture", "Other"],
        required: true
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
     status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending"
    }
},{
    timestamps: true
});

module.exports = mongoose.model(
    "Complaint",
    complaintSchema
);
