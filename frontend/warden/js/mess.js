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

function showSection(id, element) {

    // Hide all sections
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    // Remove active class from all tabs
    document.querySelectorAll(".tabs h4").forEach(tab => {
        tab.classList.remove("active");
    });

    // Show selected section
    document.getElementById(id).classList.add("active");

    // Highlight clicked tab
    element.classList.add("active");
}

async function loadMenu(){
    try{
        const response = await fetch("http://localhost:5000/get-menu");
        const menu = await response.json();

        const tbody = document.getElementById("mess-menu-table");
        tbody.innerHTML = "";

        menu.forEach(item => {
            tbody.innerHTML += `
            <tr>
            <td>${item.day}</td>
            <td>${item.breakfast}</td>
            <td>${item.lunch}</td>
            <td>${item.snacks}</td>
            <td>${item.dinner}</td>
            </tr>`;
        });
    }catch(err){
        console.log(err);
    }
}

function enableEditing() {

    const rows = document.querySelectorAll("#mess-menu-table tr");

    rows.forEach(row => {

        const cells = row.querySelectorAll("td");

        // Day ko edit nahi karna
        for(let i = 1; i < cells.length; i++){

            const value = cells[i].innerText;

            cells[i].innerHTML =
            `<input type="text" value="${value}" class="menu-input">`;

        }

    });

}

async function saveMenu(){
    const rows = document.querySelectorAll("#mess-menu-table tr");
    const menu = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");

        menu.push({
            day: cells[0].innerText,
            breakfast: cells[1].querySelector("input").value,
            lunch: cells[2].querySelector("input").value,
            snacks: cells[3].querySelector("input").value,
            dinner: cells[4].querySelector("input").value,
        });
    });

    console.log(menu);

    const response = await fetch("http://localhost:5000/menu", {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(menu)
    });

    const data = await response.json();
    alert(data.message);
    loadMenu();
}

window.onload = function () {
    loadSidebar();
    showCurrentDate();
    loadMenu();

    document.getElementById("summary").classList.add("active");
    document.querySelector(".tabs h4").classList.add("active");
    document.getElementById("edit-btn").addEventListener("click", enableEditing);
    document.getElementById("save-btn").addEventListener("click", saveMenu);
}