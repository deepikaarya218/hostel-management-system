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

async function loadNotifications() {

    const studentId = localStorage.getItem("userId");

    const response = await fetch(
        `http://localhost:5000/notifications/${studentId}`
    );

    const notifications = await response.json();

    const container = document.getElementById("notification-list");
    container.innerHTML = "";

    notifications.forEach(note => {

        const date = new Date(note.createdAt);

        container.innerHTML += `
            <div class="notify-item">
                <h3>${note.title}</h3>

                <p>${note.message}</p>

                <div class="item-footer">
                    <span>${date.toLocaleDateString("en-IN")}</span>
                    <span>${date.toLocaleTimeString("en-IN")}</span>
                    <span>Warden</span>
                </div>
            </div>
        `;

    });

}

window.onload = function () {
    loadSidebar();
    loadNotifications();
}
