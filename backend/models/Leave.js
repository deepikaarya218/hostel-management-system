const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    destination:{
        type: String, 
        required: true,
    },

    leave:{
        type: String,
        enum: ['Home', 'Emergency', 'Medical', 'Other'],
        required : true,
    },

    from:{
        type:String,
        required: true,
    },

    to:{
        type:String,
        required: true,
    },

    dept:{
        type:String,
        required: true,
    },

    ret:{
        type:String,
        required: true,
    },

    parentNo:{
        type:String,
        required: true,
    },

    emergencyNo:{
        type:String,
        required: true,
    },

    reason:{
        type:String,
        required: true,
    },
},{
    timestamps: true

});

module.exports = mongoose.model(
    "Leave",
    leaveSchema
);