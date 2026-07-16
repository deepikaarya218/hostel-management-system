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

async function addItem(){
    const name = document.getElementById("item-name").value.trim();
    const price = document.getElementById("item-price").value;

    if(name === "" || price === ""){
        alert("Please fill all fields");
        return;
    }

    const response = await fetch("http://localhost:5000/items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name, 
            price
        })
    });

    const data = await response.json();
    alert(data.message);

    document.getElementById("item-name").value = "";
    document.getElementById("item-price").value = "";

    loadItems();
}

async function loadItems(){
    try {

        const response = await fetch("http://localhost:5000/items");
        const items = await response.json();

        const container = document.getElementById("item-detail");

        container.innerHTML = "";

        items.forEach(item => {

            container.innerHTML += `
                <div class="detail">

                    <div class="item-info">
                        <div class="item-text">
                            <h4>${item.name}</h4>
                            <p>₹${item.price}</p>
                        </div>
                    </div>

                    <div class="action">
                        <span onclick="editItem('${item._id}')">🖋️</span>
                        <span onclick="deleteItem('${item._id}')">🗑️</span>
                    </div>

                </div>
            `;

        });

    } catch (err) {

        console.log(err);

    }
}

async function deleteItem(id){
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if(!confirmDelete) return;

    try{
        const response = await fetch(`http://localhost:5000/items/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        alert(data.message);
        loadItems();
    }catch(err){
        console.log(err);
    }
}

window.onload = function () {
    loadSidebar();
    showCurrentDate();
    loadMenu();
    loadItems();

    document.getElementById("summary").classList.add("active");
    document.querySelector(".tabs h4").classList.add("active");
    document.getElementById("edit-btn").addEventListener("click", enableEditing);
    document.getElementById("save-btn").addEventListener("click", saveMenu);
    document.getElementById("add-item-btn").addEventListener("click", addItem);
}