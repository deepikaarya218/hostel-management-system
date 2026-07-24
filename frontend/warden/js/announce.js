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
    let url = "http://localhost:5000/announcement";
    let method = "POST";

    if (editAnnouncementId) {
        url = `http://localhost:5000/announcement/${editAnnouncementId}`;
        method = "PUT";
    }

    console.log(url);
    console.log(method);
    try{
        const response = await fetch(url,{
            method,
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if(result.success){
            if (editAnnouncementId) {
                alert("Draft updated successfully.");
            } else {
                alert("Draft saved successfully.");
            }
            document.getElementById("title").value = "";
            document.getElementById("desc").value = "";
            document.getElementById("category-item").value = "";
            document.getElementById("priority-item").value = "";
            document.getElementById("audience-item").value = "";

            editAnnouncementId = null;

            document.querySelector(".draft").innerText = "Save Draft";
            document.querySelector(".draft").style.display = "inline-block";
            document.querySelector(".public").style.display = "inline-block";
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
    let url = "http://localhost:5000/announcement";
    let method = "POST";

    if(editAnnouncementId){
        url = `http://localhost:5000/announcement/${editAnnouncementId}`;
        method = "PUT";
    }
    try{
        const response = await fetch(url, {
            method,
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if(result.success){
            if(editAnnouncementId){
                alert("Announcement published successfully.");
            }else{
                alert("Announcement created successfully.");
            }
            document.getElementById("title").value = "";
            document.getElementById("desc").value = "";
            document.getElementById("category-item").value = "";
            document.getElementById("priority-item").value = "";
            document.getElementById("audience-item").value = "";
            document.getElementById("pin").checked = false;
            document.getElementById("notify").checked = false;

            editAnnouncementId = null;

            document.querySelector(".draft").innerText = "Save Draft";
            document.querySelector(".draft").style.display = "inline-block";
            document.querySelector(".public").style.display = "inline-block";
            document.getElementById("update-btn").style.display = "none";

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
        const response = await fetch("http://localhost:5000/announcement");
        const result = await response.json();
        const container = document.getElementById("announce-list");
        container.innerHTML = "";

        if(!result.success){
            return;
        }

        const announcements = result.announcements;

        // add data
        document.getElementById("total-announce").innerText = announcements.length;
        document.getElementById("publish-announce").innerText = announcements.filter(item => item.status === "Published").length;
        document.getElementById("total-schedule").innerText = announcements.filter(item => item.status === "Scheduled").length;
        document.getElementById("total-drafts").innerText = announcements.filter(item => item.status === "Draft").length;
        document.getElementById("total-high").innerText = announcements.filter(item => item.priority === "High").length;


        document.getElementById("total-pin").innerHTML =
            `${result.announcements.length} Active Notices`;

        result.announcements.forEach(item => {
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

                            <a href="#" onclick="editAnnouncement('${item._id}')">
                                <i class="fa-regular fa-pen-to-square"></i>
                                <span>Edit</span>
                            </a>

                            <a href="#" onclick="deleteAnnouncement('${item._id}')">
                                <i class="fa-regular fa-trash-can"></i>
                                <span>Delete</span>
                            </a>

                            ${item.status === "Published"?`
                                <a href="#" onclick="togglePin('${item._id}')">
                                <i class="fa-solid fa-thumbtack"></i>
                                <span>${item.pin ? "Unpin" : "Pin"}</span>
                                </a>
                                `:""
                            }
                        </div>

                    </div>

                </div>

                <div class="detail">

                    <span id="posted-by">Posted by Warden</span>

                    <span id="day-time">
                        • ${new Date(item.createdAt).toLocaleString()}
                    </span>

                </div>

                <div class="seen-detail">

                    <span id="publish-or-draft">${item.status.toUpperCase()}</span>

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

async function deleteAnnouncement(id){
    const confirmDelete = confirm("Delete this announcement?");
    if(!confirmDelete) return;
    try{
        const response = await fetch(`http://localhost:5000/announcement/${id}`, {
            method: "DELETE"
        });
        const result = await response.json();
        if(result.success){
            alert(result.message);
            loadAnnouncements();
        }
    }catch(err){
        console.log(err);
    }
}

async function togglePin(id){

    await fetch(`http://localhost:5000/announcement/pin/${id}`,{
        method:"PUT"
    });

    loadAnnouncements();

}

let editAnnouncementId = null;

async function editAnnouncement(id){
    try{
        const response = await fetch("http://localhost:5000/announcement");
        const result = await response.json();
        const announcement = result.announcements.find(item => item._id === id);

        if(!announcement) return;

        editAnnouncementId = id;

        showAnnouncementForm();

        document.getElementById("title").value = announcement.title;
        document.getElementById("desc").value = announcement.description;
        document.getElementById("category-item").value = announcement.category;
        document.getElementById("priority-item").value = announcement.priority;
        document.getElementById("audience-item").value = announcement.audience;

        if(announcement.status === "Draft"){
            document.querySelector(".draft").innerText = "Update Draft";
            document.querySelector(".draft").style.display = "inline-block";
            document.querySelector(".public").style.display = "inline-block";
            document.getElementById("update-btn").style.display = "none";
        }else{
            document.querySelector(".draft").style.display = "none";
            document.querySelector(".public").style.display = "none";
            document.getElementById("update-btn").style.display = "inline-block";
        }
    }catch(err){

        console.log(err);
    }
}

async function updateAnnouncement(){
    const data = {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("desc").value.trim(),
        category: document.getElementById("category-item").value,
        priority: document.getElementById("priority-item").value,
        audience: document.getElementById("audience-item").value
    };
    try{
        const response = await fetch(
            `http://localhost:5000/announcement/${editAnnouncementId}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            }
        );
        const result = await response.json();
        if(result.success){
            alert("Announcement Updated Successfully.");
            editAnnouncementId = null;
            loadAnnouncements();
            closeAnnouncementForm();
            document.querySelector(".draft").style.display="inline-block";
            document.querySelector(".public").style.display="inline-block";
            document.getElementById("update-btn").style.display="none";
        }
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