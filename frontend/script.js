let selectedRole = "student";

function selectRole(button, role){

    document.querySelectorAll(".role-btn")
    .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    selectedRole = role;
}

async function login(){

    const email = document.getElementById("useremail").value;

    const password = document.getElementById("password").value;

    if(email === "" || password === ""){
        alert("Please fill all fields");
        return;
    }

    try{

        const response = await fetch("http://localhost:5000/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        console.log(data);

        if(data.role === "student"){
            window.location.href = "student/dash_student.html";
        }

        else if(data.role === "warden"){
            window.location.href = "warden/dash_warden.html";
        }

        else if(data.role === "admin"){
            window.location.href = "admin/dash_admin.html";
        }

        else{
            alert(data.message);
        }
    }

    catch(error){

        console.log(error);

        alert("Error");
    }
}