const mongoose = require("mongoose");

const weeklyMenuSchema = new mongoose.Schema({
    day:{
        type: String,
        required: true
    },
    breakfast: {
        type: String,
        default: ""
    },
    lunch: {
        type: String,
        default: ""
    },
    snacks: {
        type: String,
        default: ""
    },
    dinner: {
        type: String,
        default: ""
    },
})

module.exports = mongoose.model("WeeklyMenu", weeklyMenuSchema);