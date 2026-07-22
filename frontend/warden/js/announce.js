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

// Outside click -> close menu
document.addEventListener("click", function () {
    document.querySelectorAll(".dropdown-menu").forEach(item => {
        item.classList.remove("show");
    });
});

window.onload = function () {
    loadSidebar();
    showCurrentDate();
}