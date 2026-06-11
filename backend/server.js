const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Complaint = require("./models/Complaint");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Register Route
app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = new User(req.body);

    await user.save();

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    res.status(200).json({
      message: "Login Successful",
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/complaints", async(req, res) => {
    try{
        console.log("Received:");
        console.log(req.body);
        const complaint = new Complaint(req.body);
        console.log("Before Save");
        await complaint.save();
        console.log("After Save");

        res.status(201).json({
            message: "Complaint Submitted",
            complaint
        });
    }catch(error){
        console.log("ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
})

app.get("/complaints", async (req, res) => {
    try {

        const complaints = await Complaint.find();

        res.json(complaints);

    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});