const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema({
    installmentNo: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
});

const feeStructureSchema = new mongoose.Schema({

    academicYear: {
        type: String,
        required: true
    },

    totalFee: {
        type: Number,
        required: true
    },

    installments: [installmentSchema]

}, { timestamps: true });

module.exports = mongoose.model("FeeStructure", feeStructureSchema);