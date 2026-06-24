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

async function submitLeave(){
    console.log("BUTTON CLICKED");
    const leaveData = {
        destination: document.getElementById("destination").value,
        leave : document.getElementById("leave").value,
        to: document.getElementById("to").value,
        from: document.getElementById("from").value,
        dept: document.getElementById("dept").value,
        ret: document.getElementById("ret").value,
        parentNo: document.getElementById("parentNo").value,
        emergencyNo: document.getElementById("emergencyNo").value,
        reason: document.getElementById("reason").value
    };

    console.log(leaveData);

    const response = await fetch(
        "http://localhost:5000/leave",
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(leaveData)
        }
    );

    const data = await response.json();
    console.log(data);
    alert(data.message);
    addLeavetoUI(data.leave);
}

async function loadLeave() {

    const response =
        await fetch("http://localhost:5000/leave");

    const leave = await response.json();

    const leaveList =
        document.getElementById("leave-list");

    leaveList.innerHTML = "";

    leave.forEach(addLeavetoUI);
}

function addLeavetoUI(leave){
    const leaveList = document.getElementById("leave-list");

    const leaveItem = document.createElement("div");

    leaveItem.classList.add("hist-item");

    leaveItem.innerHTML = `
    <div class="top">
            <h4>${leave.destination}</h4>
            <button class="status">Current Leave</button>
        </div>

        <span>🏠 ${leave.leave}</span><br>
        <span>📅 ${leave.from} to ${leave.to}</span><br>
        <span>${leave.reason}</span><br>
        <p>Applied on ${
            new Date(leave.createdAt).toLocaleDateString()
        }</p>
    `;

    leaveList.prepend(leaveItem);
        
}

async function loadStudentInfo(){
    const userId = localStorage.getItem("userId");

    const response = await fetch(
        `http://localhost:5000/user/${userId}`
    );

    const user = await response.json();

    document.getElementById("studentName").innerText = user.name;
    document.getElementById("roll").innerText = user.roll;
    document.getElementById("room").innerText = user.room;
    document.getElementById("block").innerText = user.block;
}

window.onload = () => {
    loadSidebar();
    loadLeave();
    loadStudentInfo();

    document.querySelector(".submit-btn")
        .addEventListener("click", submitLeave);
}