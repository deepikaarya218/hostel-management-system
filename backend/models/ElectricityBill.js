const mongoose = require('mongoose');

const electricityBillSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    month : String,
    amount: Number,
    unitsConsumed: Number,
    status: {
        type: String,
        enum: ['Pending', 'Verification','Paid'],
        default: 'Pending',
    }
});

module.exports = mongoose.model('ElectricityBill', electricityBillSchema);