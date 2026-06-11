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
function showComplaint() {
    document.getElementById("complaintDetail").style.display = "block";
}

function closeComplaint() {
    document.getElementById("complaintDetail").style.display = "none";
}



async function submitComplaint(){
    console.log("BUTTON CLICKED");
    const complaintData = {
        studentName: document.getElementById("studentName").value,
        room: document.getElementById("room").value,
        complaint: document.getElementById("complaint").value,
        priority: document.getElementById("priority").value,
        title: document.getElementById("title").value,
        detail: document.getElementById("detail").value
    };

    console.log(complaintData);

    const response = await fetch(
        "http://localhost:5000/complaints",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaintData)
        }
    );

    const data = await response.json();
    console.log(data);
    alert(data.message);
    addComplaintToUI(data.complaint);
}

async function loadComplaints() {

    const response =
        await fetch("http://localhost:5000/complaints");

    const complaints = await response.json();

    const complaintsList =
        document.getElementById("complaints-list");

    complaintsList.innerHTML = "";

    complaints.forEach(addComplaintToUI);
}

function addComplaintToUI(complaint) {

    const complaintsList =
        document.getElementById("complaints-list");

    const complaintItem = document.createElement("div");

    complaintItem.classList.add("complaint-item");

    complaintItem.innerHTML = `
        <h4 class="complaint-title">
            ${complaint.title} - Room ${complaint.room}
        </h4>

        <div class="complaint-meta">
            <span>
                <strong>Category:</strong>
                ${complaint.complaint}
            </span>

            <span>
                <strong>Priority:</strong>
                ${complaint.priority}
            </span>
        </div>

        <div class="complaint-actions">
            <button class="status-btn">
                Pending
            </button>

            <button class="view-btn">
                View
            </button>
        </div>
    `;

    complaintsList.appendChild(complaintItem);
}

window.onload = () => {
    loadSidebar();
    loadComplaints();

    document.querySelector(".submit-btn")
        .addEventListener("click", submitComplaint);
};