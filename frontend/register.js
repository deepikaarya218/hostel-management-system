let selectedRole = "student";

function register(button, role){

    // remove active class
    document.querySelectorAll(".role-button")
    .forEach(btn => btn.classList.remove("active"));

    // add active class
    button.classList.add("active");

    // save role
    selectedRole = role;

    // hide all forms
    document.getElementById("student-form").classList.add("hidden");
    document.getElementById("warden-form").classList.add("hidden");
    document.getElementById("admin-form").classList.add("hidden");

    // show selected form
    if(role === "student"){
        document.getElementById("student-form").classList.remove("hidden");
    }

    else if(role === "warden"){
        document.getElementById("warden-form").classList.remove("hidden");
    }

    else if(role === "admin"){
        document.getElementById("admin-form").classList.remove("hidden");
    }
}

async function submitStudent(){

    const name = document.getElementById("student-name").value;
    const email = document.getElementById("student-email").value;
    const roll = document.getElementById("student-ID").value;
    const password = document.getElementById("student-password").value;
    const confirmPassword = document.getElementById("student-confirm-password").value;
    const room = document.getElementById("student-room").value;
    const hostel = document.getElementById("student-block").value;
    const phone = document.getElementById("student-phone").value;

    if(name === "" || email === "" || roll === "" || password === "" || confirmPassword === "" || room === "" || hostel === "" || phone === ""){
        alert("Please fill all fields");
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }

    if(password.length < 6){
        alert("Password should be at least 6 characters");
        return;
    }

    try{

        const response = await fetch("http://localhost:5000/register",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                name,
                email,
                roll,
                password,
                room,
                hostel,
                phone,
                role:"student"
            })
        });

        const data = await response.text();

        alert(data);

    }

    catch(error){

        console.log(error);

        alert("Error");
    }
}

async function submitWarden(){

    const name = document.getElementById("warden-name").value;
    const block = document.getElementById("warden-block").value;
    const id = document.getElementById("warden-ID").value;
    const email = document.getElementById("warden-email").value;
    const password = document.getElementById("warden-password").value;
    const confirmPassword = document.getElementById("warden-confirm-password").value;
    const phone = document.getElementById("warden-phone").value;

    if(name === "" || email === "" || password === "" || confirmPassword === "" || phone === "" || block === "" || id === ""){
        alert("Please fill all fields");
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }

    if(password.length < 6){
        alert("Password should be at least 6 characters");
        return;
    }

    try{
        const response = await fetch("http://localhost:5000/register",{

            method:"POST",
            
            headers:{
                "Content-Type":"application/json"
            },
            
            body:JSON.stringify({
                name,
                email,
                id,
                password,
                block,
                phone,
                role:"warden",
            })
        });

        const data = await response.text();
        alert(data);
    }
    catch(error){

        console.log(error);

        alert("Error");
    }
}

async function submitAdmin(){
    const name = document.getElementById("admin-name").value;
    const id = document.getElementById("admin-ID").value;
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;
    const confirmPassword = document.getElementById("admin-confirm-password").value;
    const phone = document.getElementById("admin-phone").value;

    if(name === "" || email === "" || password === "" || confirmPassword === "" || phone === "" || id === ""){
        alert("Please fill all fields");
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }

    if(password.length < 6){
        alert("Password should be at least 6 characters");
        return;
    }

    try{
        const response = await fetch("http://localhost:5000/register",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                name,
                email,
                id,
                password,
                phone,
                role:"admin",
            })
        });

        const data = await response.text();
        alert(data);
    }
    catch(error){
        console.log(error);
        alert("Error");
    }
}