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

window.onload = function () {
    loadSidebar();
    showCurrentDate();
    loadFeeStructure();

};