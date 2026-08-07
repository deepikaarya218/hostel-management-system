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


// async function loadNotifications() {

//     const studentId = localStorage.getItem("userId");

//     const response = await fetch(
//         `http://localhost:5000/notifications/${studentId}`
//     );

//     const notifications = await response.json();

//     const container = document.getElementById("notification-list");
//     container.innerHTML = "";

//     notifications.forEach(note => {

//         const date = new Date(note.createdAt);

//         container.innerHTML += `
//             <div class="notify-item">
//                 <h3>${note.title}</h3>

//                 <p>${note.message}</p>

//                 <div class="item-footer">
//                     <span>${date.toLocaleDateString("en-IN")}</span>
//                     <span>${date.toLocaleTimeString("en-IN")}</span>
//                     <span>Warden</span>
//                 </div>
//             </div>
//         `;

//     });

// }



async function loadNotifications() {
    try {

        const response = await fetch("http://localhost:5000/student/notifications");
        const result = await response.json();

        if (!result.success) return;

        // Summary
        document.getElementById("total-announce").innerText =
            result.summary.total;

        document.getElementById("total-pinned").innerText =
            result.summary.pinned;

        document.getElementById("total-high").innerText =
            result.summary.high;

        let unread = 0;

        result.notifications.forEach(item => {
            if (localStorage.getItem(`read_${item._id}`) !== "true") {
                unread++;
            }
        });

        document.getElementById("total-unread").innerText = unread;

        const container = document.getElementById("notification-list");
        container.innerHTML = "";

        result.notifications.forEach(item => {

            const isRead =
                localStorage.getItem(`read_${item._id}`) === "true";

            container.innerHTML += `
                <div class="notification-class">

                    <div class="top-item">

                        <div class="top-left">

                            <span class="priority-detail">
                                ${item.priority.toUpperCase()} PRIORITY
                            </span>

                            ${
                                item.pin
                                ? `<span class="pinned-detail">📌 Pinned</span>`
                                : ""
                            }

                        </div>

                        <div class="top-right">

                            <span class="category-detail">
                                ${item.category}
                            </span>

                        </div>

                    </div>

                    <div class="description">

                        <div class="main-detail">

                            <h4 class="desc-heading">
                                ${item.title}
                            </h4>

                            <span class="desc-detail">
                                ${item.description}
                            </span>

                        </div>

                    </div>

                    <div class="detail">

                        <span class="by-whom">
                            Warden
                        </span>

                        <span class="date-time">
                            ${new Date(item.createdAt).toLocaleString()}
                        </span>

                        <div class="view">

                            <button
                                class="${isRead ? 'read-btn read' : 'read-btn'}"
                                ${isRead ? "disabled" : ""}
                                onclick="markAsRead('${item._id}')"
                            >
                                ${isRead ? "✔ Read" : "✔️ Mark as Read"}
                            </button>

                        </div>

                    </div>

                </div>
            `;
        });

    } catch (err) {

        console.log(err);

    }
}

async function markAsRead(id) {

    if (localStorage.getItem(`read_${id}`) === "true") {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/student/read/${id}`,
            {
                method: "PUT"
            }
        );

        const result = await response.json();

        if (result.success) {

            localStorage.setItem(`read_${id}`, "true");

            loadNotifications();

        }

    } catch (err) {

        console.log(err);

    }
}

window.onload = function () {
    loadSidebar();
    showCurrentDate();
    loadNotifications();
};