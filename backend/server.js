const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

const User = require("./models/User");
const Complaint = require("./models/Complaint");
const Leave = require("./models/Leave");
const Payment = require("./models/Payment");

const FeeStructure = require("./models/warden/FeeStructure");
const StudentBill = require("./models/warden/StudentBill");
const StudentPayment = require("./models/StudentPayment");
const Notification = require("./models/warden/Notification");

const WeeklyMenu = require("./models/WeeklyMenu");
const ExtraItem = require("./models/ExtraItem");
const Announcement = require("./models/Announcement");

const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

const storage = multer.diskStorage({
  destination: "./uploads",

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

app.use("/uploads", express.static("uploads"));

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
    const {studentId, name, items, subtotal, tax, amount, method } = req.body;

    console.log("Items received:", items);
    const orderId = "ORD" + Date.now();

    const newPayment = new Payment({
      orderId,
      studentId,
      name,
      items,
      subtotal,
      tax,
      amount,
      method,
      status: "New Order"
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

// FEE STRUCTURE

app.post("/fee-structure", async (req, res) => {
  try{
    console.log(req.body);
    const {academicYear, totalFee, installments} = req.body;
    const fee = new FeeStructure({
      academicYear, totalFee, installments
    });

    await fee.save();

    res.json({
      message: "Fee Structure Saved Successfully"
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  }
});

// STUDNET FETCH FEE DATA

app.get("/fee-structure", async (req, res) => {
  try{
    const fee = await FeeStructure.findOne().sort({createdAt: -1});
    res.json(fee);
  }
  catch(err){
    res.status(500).json({
      error: err.message
    });
  }
});

// WARDEN UPDATE FEE DATA STRUCTURE

app.put("/fee-structure/:id", async (req, res) => {
  console.log("PUT route hit");
  try{
    const updated = await FeeStructure.findByIdAndUpdate(
      req.params.id, req.body, {new : true}
    );
    res.json(updated);
  }
  catch(err){
    res.status(500).json({
      error: err.message
    });
  }
});

// BILL MAI STUDENT NAME FETCH

app.get("/students", async(req, res) => {
  try{
    const students = await User.find(
      {role: 'student'},
      {
        name: 1,
        room: 1,
      }
    );
    res.json(students);
  }
  catch(err){
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.post("/generate-bill", async(req, res) => {
  try{
    const{studentId, month, previousReading, currentReading, ratePerUnit, dueDate} = req.body;

    const unitConsumed = currentReading - previousReading;
    const billAmount = unitConsumed * ratePerUnit;

    const bill = new StudentBill({
      studentId,
      month,
      previousReading,
      currentReading,
      unitConsumed,
      ratePerUnit,
      billAmount,
      dueDate
    });

    await bill.save();

    res.json({
      message: "Bill Generated Successfully"
    });
  }

  catch(err){
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/student-bills/:studentId", async (req, res) =>{
  try{
    console.log("Student ID from URL:", req.params.studentId);
    const bills = await StudentBill.find({
      studentId : req.params.studentId
    }).sort({ createdAt: -1 });

    console.log("Bills Found:", bills);

    res.json(bills);
  }catch(err){
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.put("/update-bill/:id", async (req, res) => {

    try {

        const {
            month,
            previousReading,
            currentReading,
            ratePerUnit,
            dueDate
        } = req.body;

        const unitConsumed = currentReading - previousReading;
        const billAmount = unitConsumed * ratePerUnit;

        const updatedBill = await StudentBill.findByIdAndUpdate(

            req.params.id,

            {
                month,
                previousReading,
                currentReading,
                ratePerUnit,
                dueDate,
                unitConsumed,
                billAmount
            },

            { returnDocument: "after" }

        );

        res.json(updatedBill);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// payment veriifcation post

app.post("/pay-bill", upload.single("proof"), async (req, res) => {
  try {

    const {
      billId,
      paymentType,
      paymentMethod,
      amount
    } = req.body;

    const studentId = req.body.studentId;

    // Database me existing payment dhoondo
    let payment = await StudentPayment.findOne({
      studentId,
      billId,
      paymentType
    });

    if (payment) {

      // Existing record update karo
      payment.paymentMethod = paymentMethod;
      payment.amount = amount;
      payment.proofImage = req.file.filename;
      payment.status = "Verification";
      payment.paidOn = new Date();

      await payment.save();

    } else {

      // Pehli baar payment ho rahi hai
      payment = new StudentPayment({
        studentId,
        billId,
        paymentType,
        amount,
        paymentMethod,
        proofImage: req.file.filename,
        status: "Verification"
      });

      await payment.save();

    }

    // Sirf Electricity Bill ke liye
    if (paymentType === "Electricity Bill") {
      await StudentBill.findByIdAndUpdate(billId, {
        status: "Verification"
      });
    }

    res.json({
      message: "Payment submitted for verification."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/student-payments/:studentId", async(req, res) => {
  try{
    const payments = await StudentPayment.find({
            studentId: req.params.studentId,
            paymentType: "Hostel Fee"
        });

        res.json(payments);
  }catch(err){
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/student-payment-history/:studentId", async(req, res) => {
  try{
    const payments = await StudentPayment.find({
      studentId: req.params.studentId,
    }).sort({paidOn: -1});

    res.json(payments);
  }catch(err){
    res.status(500).json({
      error: err.message
    });
  }
});

// WARDEN FETCH VERIFICATION DATA

app.get("/warden/payment", async(req, res) => {
  try{
    const payments = await StudentPayment.find({
      status: "Verification"
    })
    .populate("studentId", "username email enrollno branch year")
    .sort({createdAt:-1});

    res.json(payments);
  }catch(err){
    console.log(err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

// WARDEN APPROVE STUDENT PAYMENT

app.put("/warden/payment/:id/approve", async(req, res) => {
  try{
    const payment = await StudentPayment.findById(req.params.id);

    if(!payment){
      return res.status(404).json({message: "Payment not found"});
    }
    payment.status = "Approved";
    await payment.save();

    await StudentBill.findByIdAndUpdate(payment.billId,{
      status: "Paid"
    });

    res.json({message: "Payment Approved"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: "Server Error"});
  }
});


// WARDEN REJECT STUDENT PAYMENT

app.put("/warden/payment/:id/reject", async(req, res) => {
  try{
    const payment = await StudentPayment.findById(req.params.id);

    if(!payment){
      return res.status(404).json({message: "Payment not found"});
    }
    payment.status = "Rejected";
    await payment.save();

    await StudentBill.findByIdAndUpdate(payment.billId,{
      status: "Rejected"
    });

    res.json({message: "Payment Rejected"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: "Server Error"});
  }
});

// WARDEN FULL DETAIL TABLE

app.get("/warden/student-payment-summary", async (req, res) => {
  try{
    const feeStructure = await FeeStructure.findOne();
    const totalInstallments = feeStructure.installments.length;

    const students = await User.find({ role: "student" });

    const result = [];

    for(const student of students){
      const hostelPayments = await StudentPayment.find({
        studentId: student._id,
        paymentType: "Hostel Fee"
      });

      const hostelPaid = hostelPayments.filter(
        p => p.status === "Approved"
      ).length;

      const bills = await StudentBill.find({
          studentId: student._id
      });

      const billPaid = bills.filter(
          b => b.status === "Paid"
      ).length;

      let dueAmount = 0;

      const hostelPaidAmount = hostelPayments.filter(p => p.status === "Approved")
      .reduce((sum, p) => sum + p.amount, 0);

      const hostelDue = feeStructure.totalFee - hostelPaidAmount;

      const electricityDue = bills
        .filter(b => b.status !== "Paid")
        .reduce((sum, b) => sum + b.billAmount, 0);

      dueAmount = hostelDue + electricityDue;

      const lastPayment = await StudentPayment.findOne({
        studentId: student._id
      }).sort({paidOn: -1});

      result.push({
        studentId: student._id,
        studentName: student.name,
        rollNo: student.roll,
        roomNo: student.room,
        hostelFee: `${hostelPaid}/${totalInstallments}`,
        electricity: `${billPaid}/${bills.length}`,
        dueAmount,
        lastPayment
      });
    }
    res.json(result);
  }
  catch(err){
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/warden/student-payment-details/:studentId", async (req, res) => {
    try {

        const studentId = req.params.studentId;

        const student = await User.findById(studentId);

        const feeStructure = await FeeStructure.findOne();

        const hostelPayments = await StudentPayment.find({
            studentId,
            paymentType: "Hostel Fee"
        });

        const bills = await StudentBill.find({ studentId });

        res.json({
            student,
            feeStructure,
            hostelPayments,
            bills
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// warden recent table

app.get("/warden/recent-payments", async(req, res) => {
  try{
    const payments = await StudentPayment.find({
      status: "Approved"
    })
    .populate("studentId", "name")
    .sort({paidOn: -1})
    .limit(10);

    res.json(payments);
  }catch(err){
    res.status(500).json({
      error: err.message
    });
  }
});

// warden pending table
app.get("/warden/pending-payment-summary", async (req, res) => {
    try {

        const feeStructure = await FeeStructure.findOne();
        const students = await User.find({ role: "student" });

        const result = [];

        for (const student of students) {

            // Approved Hostel Payments
            const hostelPayments = await StudentPayment.find({
                studentId: student._id,
                paymentType: "Hostel Fee",
                status: "Approved"
            });

            const hostelPaidAmount = hostelPayments.reduce(
                (sum, p) => sum + p.amount,
                0
            );

            const hostelPending =
                feeStructure.totalFee - hostelPaidAmount;

            const hostelPendingInstallments =
                feeStructure.installments.length - hostelPayments.length;

            // Pending Electricity Bills
            const pendingBills = await StudentBill.find({
                studentId: student._id,
                status: "Pending"
            });

            const electricityPendingAmount = pendingBills.reduce(
                (sum, b) => sum + b.billAmount,
                0
            );

            const totalPending =
                hostelPending + electricityPendingAmount;

            // Agar kuch bhi pending nahi hai to table me mat dikhao
            if (totalPending <= 0) continue;

            // Hostel ki next due date
            let hostelDueDate = null;

            if (hostelPendingInstallments > 0) {

                hostelDueDate =
                    feeStructure.installments[hostelPayments.length]?.dueDate;

            }

            // Electricity ki nearest due date
            let billDueDate = null;

            if (pendingBills.length > 0) {

                billDueDate = pendingBills
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]
                    .dueDate;

            }

            // Earliest Due Date
            let dueDate = hostelDueDate || billDueDate;

            if (hostelDueDate && billDueDate) {

                dueDate =
                    new Date(hostelDueDate) < new Date(billDueDate)
                        ? hostelDueDate
                        : billDueDate;

            }

            result.push({

                studentId: student._id,

                studentName: student.name,

                pendingAmount: totalPending,

                dueDate,

                hostelFee:
                    `${hostelPendingInstallments}/${feeStructure.installments.length} Pending`,

                electricityBill:
                    `${pendingBills.length} Pending`

            });

        }

        res.json(result);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }
});

// warden send notification

app.post("/warden/send-reminder/:studentId", async(req, res) => {
  try{
    const studentId = req.params.studentId;
    const feeStructure = await FeeStructure.findOne();
    const hostelPayments = await StudentPayment.find({
      studentId,
      paymentType: "Hostel Fee",
      status: "Approved"
    });

    const pendingBills = await StudentBill.find({
      studentId,
      status: "Pending"
    });

     if (hostelPayments.length < feeStructure.installments.length) {

            const nextInstallment =
                feeStructure.installments[hostelPayments.length];

            await Notification.create({

                studentId,

                title: "Upcoming Hostel Fee Payment",

                message: `Installment #${nextInstallment.installmentNo} of ₹${nextInstallment.amount} is due on ${new Date(nextInstallment.dueDate).toLocaleDateString("en-IN")}. Please complete the payment before the due date.`

            });

        }

        // Electricity Notifications
        for (const bill of pendingBills) {

            await Notification.create({

                studentId,

                title: "Pending Electricity Bill",

                message: `Your ${bill.month} electricity bill of ₹${bill.billAmount} is pending. Kindly pay it before ${new Date(bill.dueDate).toLocaleDateString("en-IN")}.`

            });

        }

        res.json({
            message: "Reminder Sent Successfully."
        });

  }catch(err){
    res.status(500).json({
      error: err.message
    })
  }
})

// student receive notification

app.get("/student-notifications/:studentId", async (req, res) => {
    try {

        const notifications = await Notification.find({
            studentId: req.params.studentId
        }).sort({ createdAt: -1 });

        res.json(notifications);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

app.get("/seed-menu", async(req, res) => {
  try{
    const count = await WeeklyMenu.countDocuments();

    if(count > 0){
      return res.send("Menu already exits");
    }

    const days = [
      "Monday",
      "Tuesday",
      "wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];

    const menu = days.map(day => ({
      day,
      breakfast: "",
      lunch: "",
      snacks: "",
      dinner: ""
    }));

    await WeeklyMenu.insertMany(menu);
    res.send("Weekly menu created successfully!");
  }
  catch(err){
    res.status(500).json({error: err.messgae});
  }
});

app.get("/get-menu", async (req, res) => {
    try {
      console.log("MENU API HIT");
        const menu = await WeeklyMenu.find();
        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put("/menu", async(req, res) => {
  console.log("PUT API HIT");
  console.log(req.body);
  try{
    const menu = req.body;
    for(const item of menu){
      await WeeklyMenu.findOneAndUpdate(
        {day: item.day},
        {
          breakfast: item.breakfast,
          lunch: item.lunch,
          snacks: item.snacks,
          dinner: item.dinner
        }
      );
    }

    res.json({
      success: true,
      message: "Menu Updated Successfully"
    });
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
})

app.post("/items", async(req, res) =>{
  try{
    const {name, price} = req.body;
    const item = new ExtraItem({
      name,
      price
    });

    await item.save();

    res.json({
      success: true,
      message: "Item Added Successfully"
    });
  }catch(err){
    success: false,
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/items", async(req, res) => {
  try{
    const items = await ExtraItem.find();
    res.json(items);
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.delete("/items/:id", async(req, res) => {
  try{
    await ExtraItem.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Item Deleted Successfully"
    });
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// warden want all order

app.get("/orders", async(req, res) => {
  try{
    const orders = await Payment.find().sort({ date: -1 })
    res.json(orders);
  }catch(err){
    console.error(err);   // <-- ye add karo
    res.status(500).json({
      error: err.message
    });
  }
});

app.put("/orders/:id", async (req, res) => {
  try {

    const { status } = req.body;
     console.log("Status received:", status);

    const order = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

     console.log("Order found:", order.orderId);

    // Sirf Ready hone par notification bhejo
    if (status === "Ready") {
      console.log("Inside Ready block");

      await Notification.create({
        studentId: order.studentId,
        title: "🍽️ Order Ready for Pickup",
        message: `Your order (${order.orderId}) is ready. Please collect it from the mess counter.`,
      });

    }

    if (status === "Completed") {
      console.log("Inside Complete block");

      await Notification.create({
        studentId: order.studentId,
        title: "🍽️ Order Completed",
        message: `Your order (${order.orderId}) is completed.`,
      });

    }

    res.json({
      success: true,
      message: "Order status updated successfully"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

app.get("/notifications/:studentId", async (req, res) => {

  try {

    const notifications = await Notification.find({
      studentId: req.params.studentId
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

app.post("/announcement", async(req, res) => {
  try{
    const {title, description, category, priority, audience, status, pin, notify, scheduleDate, isScheduled} = req.body;

    if (!title || !description || !audience) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const announcement = new Announcement({
      title, description, category, priority, audience, status, pin, notify, scheduleDate,
    isScheduled
    });

    // console.log(announcement);
    await announcement.save();

    res.status(201).json({
      success: true,
      message: "Announcement created successfully"
    });

  }catch(err){
    console.log(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


app.get("/announcement", async (req, res) => {
    try {

        const announcements = await Announcement.find()
            .sort({ pin: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            announcements
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
});

app.delete("/announcement/:id", async(req, res) => {
  try{
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Announcement deleted successfully"
    });
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.put("/announcement/pin/:id", async(req, res) => {
  try{
    const announcement = await Announcement.findById(req.params.id);
    announcement.pin = !announcement.pin;
    await announcement.save();

    res.json({
      success: true
    });
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.put("/announcement/:id", async(req, res) => {
  try{
    const updateAnnouncement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json({
      success: true,
      message: "Announcement updated successfully",
      announcement: updateAnnouncement
    });
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/student/notifications", async (req, res) => {
    try {

        const notifications = await Announcement.find({
            status: "Published",
        }).sort({
            pin: -1,
            createdAt: -1
        });

        const summary = {
            total: notifications.length,
            pinned: notifications.filter(item => item.pin).length,
            high: notifications.filter(item => item.priority === "High").length,

            // Abhi read feature nahi hai
            unread: notifications.length
        };

        res.status(200).json({
            success: true,
            summary,
            notifications
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
});

app.put("/student/read/:id", async (req, res) => {
    try {

        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        announcement.readBy += 1;

        await announcement.save();

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
});


// Server Start
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

cron.schedule("* * * * *", async () => {

    try {

        const now = new Date();

        const announcements = await Announcement.find({
            status: "Scheduled",
            scheduleDate: { $lte: now }
        });

        for (const announcement of announcements) {

            announcement.status = "Published";
            announcement.isScheduled = false;

            await announcement.save();

            console.log(
                `Scheduled announcement published: ${announcement.title}`
            );

        }

    } catch (err) {

        console.log("Cron Error:", err.message);

    }

});