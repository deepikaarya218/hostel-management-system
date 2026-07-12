function loadSidebar() {
    fetch("slidebar.html")
        .then(response => {
            console.log(response.status);
            return response.text();
        })
        .then(data => {
            console.log(data);
            document.getElementById("slidebar-container").innerHTML = data;
        })
        .catch(err => console.log(err));
}

// Global variable
let feeId = "";

function showCurrentDate(){
    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const formattedDate = today.toLocaleDateString("en-IN", options);
    document.getElementById("current-date").innerText = formattedDate;
}

async function saveFeeStructure(){
    const academicYear = document.getElementById("year").value;
    const totalFee = Number(document.getElementById("total-fee").value);

    const installments = [
        {
            installmentNo: 1,
            amount: Number(document.getElementById("amount1").value),
            dueDate: document.getElementById("date1").value,
        },
        {
            installmentNo: 2,
            amount: Number(document.getElementById("amount2").value),
            dueDate: document.getElementById("date2").value,
        },
        {
            installmentNo: 3,
            amount: Number(document.getElementById("amount3").value),
            dueDate: document.getElementById("date3").value,
        },
    ];

    const data = {academicYear, totalFee, installments};
    try{
        const res = await fetch("http://localhost:5000/fee-structure",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message);
    }catch(err){
        console.log(err);

        alert("Unable to save fee structure");
    }
}

async function loadFeeStructure(){

    try{

        const res = await fetch("http://localhost:5000/fee-structure");
        const fee = await res.json();

        feeId = fee._id;

        document.getElementById("year").value = fee.academicYear;
        document.getElementById("total-fee").value = fee.totalFee;

        document.getElementById("amount1").value = fee.installments[0].amount;
        document.getElementById("date1").value =
            fee.installments[0].dueDate.substring(0,10);

        document.getElementById("amount2").value = fee.installments[1].amount;
        document.getElementById("date2").value =
            fee.installments[1].dueDate.substring(0,10);

        document.getElementById("amount3").value = fee.installments[2].amount;
        document.getElementById("date3").value =
            fee.installments[2].dueDate.substring(0,10);

    }catch(err){
        console.log(err);
    }

}

async function updateFeeStructure(){

    const data = {

        academicYear: document.getElementById("year").value,

        totalFee: Number(document.getElementById("total-fee").value),

        installments: [

            {
                installmentNo:1,
                amount:Number(document.getElementById("amount1").value),
                dueDate:document.getElementById("date1").value
            },

            {
                installmentNo:2,
                amount:Number(document.getElementById("amount2").value),
                dueDate:document.getElementById("date2").value
            },

            {
                installmentNo:3,
                amount:Number(document.getElementById("amount3").value),
                dueDate:document.getElementById("date3").value
            }

        ]

    };

    try{

        const res = await fetch(`http://localhost:5000/fee-structure/${feeId}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        const result = await res.json();

        alert("Fee Structure Updated Successfully");

        loadFeeStructure();

    }catch(err){

        console.log(err);

    }

}

async function loadStudents(){
    console.log("loadStudents called");
    try{
        const res = await fetch("http://localhost:5000/students");
        const students = await res.json();
        console.log(students);

        const select = document.getElementById("name");

        select.innerHTML = "<option value=' '>Select Student</option>";

        students.forEach(student => {
            select.innerHTML += `
                <option value="${student._id}">
                    ${student.name} - ${student.room}
                </option>
            `;
        });
    }catch(err){
        console.log(err);
    }
}

async function generateBill(){
     if (
        !document.getElementById("name").value ||
        !document.getElementById("prev-reading").value ||
        !document.getElementById("curr-reading").value ||
        !document.getElementById("unit").value ||
        !document.getElementById("due-date").value
    ) {
        alert("Please fill all fields.");
        return;
    }

    const data = {
        studentId: document.getElementById("name").value,

        month: document.getElementById("month").value,

        previousReading: Number(document.getElementById("prev-reading").value),

        currentReading: Number(document.getElementById("curr-reading").value),

        ratePerUnit: Number(document.getElementById("unit").value),

        dueDate: document.getElementById("due-date").value
    };

    try{
        const res = await fetch("http://localhost:5000/generate-bill", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await res.json();

        alert(result.message);
    }catch (err) {
        console.log(err);
    }
}

function calculateBill() {

    const previous = Number(document.getElementById("prev-reading").value) || 0;
    const current = Number(document.getElementById("curr-reading").value) || 0;
    const rate = Number(document.getElementById("unit").value) || 0;

    const units = current - previous;
    const amount = units * rate;

    document.getElementById("unit-total").innerText = units;
    document.getElementById("bill-total").innerHTML = "₹" + amount;
}

let billId = "";

async function editBill(id){

    billId = id;

    const studentId = localStorage.getItem("userId");

    const res = await fetch(`http://localhost:5000/student-bills/${studentId}`);

    const bills = await res.json();

    const bill = bills.find(b => b._id === id);

    document.getElementById("month").value = bill.month;
    document.getElementById("prev-reading").value = bill.previousReading;
    document.getElementById("curr-reading").value = bill.currentReading;
    document.getElementById("unit").value = bill.ratePerUnit;
    document.getElementById("due-date").value =
        bill.dueDate.substring(0,10);

    calculateBill();
}

async function loadPayments(){
    const res = await fetch("http://localhost:5000/warden/payment");

    const payments = await res.json();

    const tbody = document.getElementById("payment-verify-table");

    tbody.innerHTML = "";

    payments.forEach(payment => {
        tbody.innerHTML += `
        <tr>
        <td>${payment.studentId?.username || "-"}</td>
        <td>${payment.paymentType}</td>
        <td>${payment.amount}</td>
        <td>${payment.paymentMethod}</td>
        
        <td>
        <a href= "http://localhost:5000/uploads/${payment.proofImage}" target="_blank">
        View </a>
        </td>
        
        <td>${payment.paidOn ? new Date(payment.paidOn).toLocaleDateString("en-IN"): "-"}</td>

            <td>${payment.status}</td>
            <td>
                <button onclick="approvePayment('${payment._id}')">
                    Approve
                </button>

                <button onclick="rejectPayment('${payment._id}')">
                    Reject
                </button>

            </td>

        </tr>`;
    });
}

async function approvePayment(id){
    await fetch (`http://localhost:5000/warden/payment/${id}/approve`,{
        method:"PUT"
    });

    loadPayments();
}

async function rejectPayment(id){

    await fetch(`http://localhost:5000/warden/payment/${id}/reject`,{
        method:"PUT"
    });

    loadPayments();

}

let studentPayments = [];

async function loadStudentPayments(){
    const res = await fetch(
        "http://localhost:5000/warden/student-payment-summary"
    );

    const students = await res.json();
    studentPayments = students;

    renderTable(studentPayments);
}

function filterTable(){
    const search = document.getElementById("search-name").value.toLowerCase();
    const status = document.getElementById("filter").value;

    const filtered = studentPayments.filter(student => {
        const matchSearch = 
           student.studentName.toLowerCase().includes(search) ||
           student.rollNo.toLowerCase().includes(search) ||
           student.roomNo.toLowerCase().includes(search);

        let matchStatus = true;
        if(status == "paid"){
            matchStatus = student.dueAmount === 0;
        }
        if(status === "pending"){
            matchStatus = student.dueAmount > 0;
        }

        return matchSearch && matchStatus;
    });
    renderTable(filtered);
}

function renderTable(data) {

    const tbody = document.getElementById("payment-status-body");

    tbody.innerHTML = "";

    data.forEach(student => {

        tbody.innerHTML += `
            <tr>
                <td>${student.studentName}</td>
                <td>${student.rollNo}</td>
                <td>${student.roomNo}</td>
                <td>${student.hostelFee} Paid</td>
                <td>${student.electricity} Paid</td>
                <td>₹${student.dueAmount}</td>

                <td>
                    ${
                        student.lastPayment
                        ? `₹${student.lastPayment.amount}<br>
                           ${student.lastPayment.paymentType}<br>
                           ${new Date(student.lastPayment.paidOn).toLocaleDateString("en-IN")}`
                        : "-"
                    }
                </td>

                <td>
                    <button class="view-btn" onclick="viewDetails('${student.studentId}')">
                        View Details
                    </button>
                </td>
            </tr>
        `;
    });
}

function openModal(){
    document.getElementById("studentDetailModal").classList.add("show");
    // document.getElementById("modaloverlay").classList.add("show");
}

function closeModal(){

    document
    .getElementById("studentDetailModal")
    .classList.remove("show");

    document
    .getElementById("modalOverlay")
    .classList.remove("show");

}

function viewDetails(studentId){

    console.log(studentId);

    openModal();

}

async function viewDetails(studentId){

    openModal();

    const res = await fetch(
        `http://localhost:5000/warden/student-payment-details/${studentId}`
    );

    const data = await res.json();

    console.log(data);

    fillStudent(data);
    fillHostelFee(data);
    fillBills(data);
    fillSummary(data);

}

function fillStudent(data){

    document.getElementById("Studentname").innerText =
        data.student.name;

    document.getElementById("rollNo").innerText =
        data.student.roll;

    document.getElementById("roomNo").innerText =
        data.student.room;

    document.getElementById("contactNo").innerText =
        data.student.phone;

}

function fillHostelFee(data){

    const tbody =
    document.getElementById("hostel-fee-status");

    tbody.innerHTML = "";

    data.feeStructure.installments.forEach(item=>{

        const payment = data.hostelPayments.find(
            p => p.billId.toString() === item._id.toString()
        );

        let status = "Pending";

        if(payment)
            status = payment.status;

        tbody.innerHTML += `
        <tr>

            <td>Installment ${item.installmentNo}</td>

            <td>₹${item.amount}</td>

            <td>${new Date(item.dueDate)
                .toLocaleDateString("en-IN")}</td>

            <td>
                <span class="${status.toLowerCase()}">
                    ${status}
                </span>
            </td>

        </tr>
        `;

    });

}

function fillBills(data){

    const tbody =
    document.getElementById("hostel-bill-status");

    tbody.innerHTML = "";

    data.bills.forEach(bill=>{

        tbody.innerHTML += `

        <tr>

            <td>${bill.month}</td>

            <td>${bill.unitConsumed}</td>

            <td>₹${bill.billAmount}</td>

            <td>
                <span class="${bill.status.toLowerCase()}">
                    ${bill.status}
                </span>
            </td>

        </tr>

        `;

    });

}

function fillSummary(data){

    const totalFee =
        data.feeStructure.totalFee;

    const hostelPaid =
        data.hostelPayments
        .filter(p=>p.status==="Approved")
        .reduce((sum,p)=>sum+p.amount,0);

    const totalBill =
        data.bills.reduce((sum,b)=>sum+b.billAmount,0);

    const billPaid =
        data.bills
        .filter(b=>b.status==="Paid")
        .reduce((sum,b)=>sum+b.billAmount,0);

    const pending =
        (totalFee-hostelPaid)
        +(totalBill-billPaid);

    document.getElementById("modal-total-fee").innerText =
        "₹"+totalFee;

    document.getElementById("paid-fee").innerText =
        "₹"+hostelPaid;

    document.getElementById("total-bill").innerText =
        "₹"+totalBill;

    document.getElementById("paid-bill").innerText =
        "₹"+billPaid;

    document.getElementById("total-pending").innerText =
        "₹"+pending;

}

async function loadRecentPayments(){
    const res = await fetch("http://localhost:5000/warden/recent-payments");
    const payments = await res.json();
    console.log(payments);

    const tbody = document.getElementById("recent-payment-body");
    tbody.innerHTML = "";

    payments.forEach(payment => {
        console.log(payment);
        let installment = "-";

        if (payment.paymentType === "Hostel Fee") {
            installment = "Hostel Fee";
        } else {
            installment = "Electricity Bill";
        }

        tbody.innerHTML += `
            <tr>

                <td>${payment.studentId.name}</td>

                <td>${payment.paymentType}</td>

                <td>₹${payment.amount}</td>

                <td>${payment.paymentMethod}</td>

                <td>
                    ${new Date(payment.paidOn).toLocaleDateString("en-IN")}
                </td>

            </tr>
        `;
    });
}

async function loadPendingSummary() {

    const res = await fetch(
        "http://localhost:5000/warden/pending-payment-summary"
    );

    const students = await res.json();

    const tbody = document.getElementById("pending-payment-body");

    tbody.innerHTML = "";

    students.forEach(student => {

        tbody.innerHTML += `
            <tr>

                <td>${student.studentName}</td>

                <td>₹${student.pendingAmount}</td>

                <td>
                    ${student.dueDate
                        ? new Date(student.dueDate).toLocaleDateString("en-IN")
                        : "-"}
                </td>

                <td>${student.hostelFee}</td>

                <td>${student.electricityBill}</td>

                <td>
                    <button class="notify-btn"
                        onclick="sendReminder('${student.studentId}')">
                        Notify
                    </button>
                </td>

            </tr>
        `;

    });
}

async function sendReminder(studentId){
    const res = await fetch(
        `http://localhost:5000/warden/send-reminder/${studentId}`,
        {
            method:"POST"
        }
    );
    const data = await res.json();
    alert(data.message);
}

window.onload = function () {
    loadSidebar();
    showCurrentDate();
    loadFeeStructure();
    loadStudents();
    loadPayments();
    loadStudentPayments();
    loadRecentPayments();
    loadPendingSummary();
};