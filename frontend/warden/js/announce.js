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

function showAnnouncementForm(){
    document.getElementById("add-announce").style.display = "block";
}

function closeAnnouncementForm(){
    document.getElementById("add-announce").style.display = "none";
}

function toggleMenu(event) {
    event.stopPropagation();

    const menu = event.currentTarget.nextElementSibling;

    // Pehle sab menus band karo
    document.querySelectorAll(".dropdown-menu").forEach(item => {
        if(item !== menu){
            item.classList.remove("show");
        }
    });

    // Sirf current menu toggle karo
    menu.classList.toggle("show");
}

function openPublishModal(){
    document.querySelector(".modal").classList.add("active");
}

function closePublishModal(){
    document.querySelector(".modal").classList.remove("active");
}

async function saveDraft(){
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("desc").value.trim();
    const category = document.getElementById("category-item").value;
    const priority = document.getElementById("priority-item").value;
    const audience = document.getElementById("audience-item").value;

    const data = {
        title,
        description,
        category,
        priority,
        audience,
        status: "Draft",
        pin: false,
        notify: false
    };
    try{
        const response = await fetch("http://localhost:5000/announcement",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if(result.success){
            alert("Draft saved successfully.");
            document.getElementById("title").value = "";
            document.getElementById("desc").value = "";
            document.getElementById("category-item").value = "";
            document.getElementById("priority-item").value = "";
            document.getElementById("audience-item").value = "";
            loadAnnouncements();
            closeAnnouncementForm();
        }
        else{
            alert(result.message);
        }
    }
    catch(err){
        console.log(err);
        alert("Server Error");
    }
}

console.log("After saveDraft");

async function savePublish(){
    console.log("savePublish called");
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("desc").value.trim();
    const category = document.getElementById("category-item").value;
    const priority = document.getElementById("priority-item").value;
    const audience = document.getElementById("audience-item").value;
    const pin = document.getElementById("pin").checked;
    const notify = document.getElementById("notify").checked;

    const data = {
        title,
        description,
        category,
        priority,
        audience,
        status: "Published",
        pin,
        notify
    };
    try{
        const response = await fetch("http://localhost:5000/announcement", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if(result.success){
            alert("Announcement published successfully.");
            document.getElementById("title").value = "";
            document.getElementById("desc").value = "";
            document.getElementById("category-item").value = "";
            document.getElementById("priority-item").value = "";
            document.getElementById("audience-item").value = "";
            document.getElementById("pin").checked = false;
            document.getElementById("notify").checked = false;
            loadAnnouncements();
            closePublishModal();
            closeAnnouncementForm();
        }
        else{
            alert(result.message);
        }
    }catch(err){
        console.log(err);
        alert("Server Error");
    }
}

async function loadAnnouncements(){
    try{
        const resposne = await fetch("http://localhost:5000/announcement");
        const result = await response.json();
        const container = document.getElementById("announce-list");
        container.innerHTML = "";

        if(!result.success){
            return;
        }

        document.getElementById("total-pin").innerHTML =
            `${result.announcements.length} Active Notices`;

        result.announments.forEach(item => {
            container.innerHTML += `
            <div class="announce-item">
            <div class="top-item">
            <span id="priority-detail">
                        ${item.priority.toUpperCase()} PRIORITY
                    </span>
            ${
                        item.pin
                        ?
                        `<span id="pinned-detail">📌 Pinned</span>`
                        :
                        ""
                    }
                    <span id="category-detail">
                        ${item.category.toUpperCase()}
                    </span>

                </div>
                 <div class="description-item">

                    <div class="main-detail">

                        <h4>${item.title}</h4>

                        <span>
                            ${item.description}
                        </span>

                    </div>

                    <div class="action-menu">

                        <button class="menu-btn" onclick="toggleMenu(event)">
                            <i class="fa-solid fa-ellipsis"></i>
                        </button>

                        <div class="dropdown-menu">

                            <a href="#">
                                <i class="fa-regular fa-pen-to-square"></i>
                                <span>Edit</span>
                            </a>

                            <a href="#">
                                <i class="fa-regular fa-trash-can"></i>
                                <span>Delete</span>
                            </a>

                            <a href="#">
                                <i class="fa-solid fa-thumbtack"></i>
                                <span>Pin / Unpin</span>
                            </a>

                            <a href="#">
                                <i class="fa-regular fa-copy"></i>
                                <span>Duplicate</span>
                            </a>

                        </div>

                    </div>

                </div>

                <div class="detail">

                    <span>Posted by Warden</span>

                    <span>
                        • ${new Date(item.createdAt).toLocaleString()}
                    </span>

                </div>

                <div class="seen-detail">

                    <span>${item.status}</span>

                    ${
                        item.notify
                        ?
                        `<span>🔔 Students Notified</span>`
                        :
                        ""
                    }

                </div>

            </div>`;
        });
    }catch(err){
        console.log(err);
    }
}

// Outside click -> close menu
document.addEventListener("click", function () {
    document.querySelectorAll(".dropdown-menu").forEach(item => {
        item.classList.remove("show");
    });
});

window.onload = function () {
    loadSidebar();
    showCurrentDate();
    loadAnnouncements();
}