const mongoose = require("mongoose");

const studentPaymentSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    billId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    paymentType: {
        type: String,
        enum: ["Hostel Fee", "Electricity Bill"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["UPI", "Bank Transfer", "Cash Deposit"],
        required: true
    },

    proofImage: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },

    paidOn: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model("StudentPayment", studentPaymentSchema);