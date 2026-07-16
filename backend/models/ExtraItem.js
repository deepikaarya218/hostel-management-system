const mongoose = require("mongoose");

const extraItemSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("ExtraItem", extraItemSchema);