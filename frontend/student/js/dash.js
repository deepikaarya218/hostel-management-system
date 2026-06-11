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

const dashData={
    fee: {
        status: "Pending",
        amount: 2500
    },

    complaints: {
        open: 1,
        resolved: 2
    },

    attendance: {
        percentage: 94,
        status: "Marked"
    },

    announcements: {
        count: 3,
        last: "2 days ago"
    }
};

async function loadDashboard(){
    const response = await fetch(
        "http://localhost:5000/dashboard/1"
    );
    const data = await response.json();

    document.getElementById("fee-status").innerText = dashData.fee.status;

    document.getElementById("fee-amount").innerText =
    "₹" + dashData.fee.amount;

    document.getElementById("open-complaints").innerText =
    dashData.complaints.open + " Open";

    document.getElementById("resolved-complaints").innerText =
    dashData.complaints.resolved + " Resolved";

    document.getElementById("attendance-percent").innerText =
    dashData.attendance.percentage + "%";

    document.getElementById("attendance-status").innerText =
    dashData.attendance.status;

    document.getElementById("announce-count").innerText =
    dashData.announcements.count + " New";

    document.getElementById("announce-last").innerText =
    "Last: " + dashData.announcements.last;
}
window.onload = function () {
    loadSidebar();
    loadDashboard();    
};