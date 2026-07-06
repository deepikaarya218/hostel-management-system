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

async function updateBill(){

    const data = {

        month: document.getElementById("month").value,

        previousReading: Number(document.getElementById("prev-reading").value),

        currentReading: Number(document.getElementById("curr-reading").value),

        ratePerUnit: Number(document.getElementById("unit").value),

        dueDate: document.getElementById("due-date").value

    };

    const res = await fetch(

        `http://localhost:5000/update-bill/${billId}`,

        {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        }

    );

    const result = await res.json();

    alert("Bill Updated Successfully");

    loadBills();

    calculateBill();
}

window.onload = function () {
    loadSidebar();
    showCurrentDate();
    loadFeeStructure();
    loadStudents();
    updateBill();
};