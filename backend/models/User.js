const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    block: String,
    room: String,
    phone: String,
    roll: String,
});

module.exports = mongoose.model("User", userSchema);