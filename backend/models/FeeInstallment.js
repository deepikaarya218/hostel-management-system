const mongoose = require('mongoose');

const feeInstallmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    installmentNumber: Number,
    amount: Number,
    dueDate: Date,
    status: {
        type: String, 
        enum: ["Pending", "Verification", "Paid"],
        default: "Pending"
    }
});

module.exports = mongoose.model('FeeInstallment', feeInstallmentSchema);