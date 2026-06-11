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