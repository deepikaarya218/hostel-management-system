const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Complaint = require("./models/Complaint");
const Leave = require("./models/Leave");
const Payment = require("./models/Payment");

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

    console.log(req.body);
    const user = new User(req.body);

    console.log("USER:", user);

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

    console.log("User from DB:", user);
    console.log("User Name:", user.name);

    res.status(200).json({
      message: "Login Successful",
      role: user.role,
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// API → save payment
app.post("/payment", async (req, res) => {
  try {
    const { name, items, subtotal, tax, amount, method } = req.body;

    console.log("Items received:", items);

    const newPayment = new Payment({
      name,
      items,
      subtotal,
      tax,
      amount,
      method
    });

    await newPayment.save();

    const payment = await Payment.findById(newPayment._id);
    console.log(payment);

    res.json({ message: "Payment saved successfully!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/payment/:name", async(req, res) => {
  try{
    const payments = await Payment.find({
      name : req.params.name
    }).sort({date: -1});

    res.json(payments);
  }
  catch(err){
    res.status(500).json({error: err.message});
  }
})


// COMPLAINT

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

// LEAVE

app.get("/leave", async (req, res) => {
  try{
    const leave = await Leave.find();
    res.json(leave);
  } catch(error){
    res.status(500).json({
      message: error.message
    });
  }
});

app.post("/leave", async(req, res) => {
    try{
        console.log("Received:");
        console.log(req.body);
        const leave = new Leave(req.body);
        console.log("Before Save");
        await leave.save();
        console.log("After Save");

        res.status(201).json({
            message: "Leave Submitted",
            leave
        });
    }catch(error){
        console.log("ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
})

app.get("/user/:id", async (req, res) => {
  try{
    const user = await User.findById(req.params.id);

    res.json(user);
  }catch(error){
    res.status(500).json({
      message: error.message
    });
  }
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});