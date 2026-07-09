const mongoose = require("mongoose");

const studentBillSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    month: {
        type: String,
        required: true
    },

    previousReading: {
        type: Number,
        required: true
    },

    currentReading: {
        type: Number,
        required: true
    },

    unitConsumed: {
        type: Number,
        required: true
    },

    ratePerUnit: {
        type: Number,
        required: true
    },

    billAmount: {
        type: Number,
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Verification", "Paid", "Rejected"],
        default: "Pending"
    },

    paymentMethod: {
        type: String,
        default: "-"
    },

    paidOn: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model("StudentBill", studentBillSchema);