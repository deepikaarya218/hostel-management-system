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

window.onload = function () {
    loadSidebar();
    showCurrentDate();

    document.getElementById("summary").classList.add("active");
    document.querySelector(".tabs h4").classList.add("active");
}