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

function updateMealStatus(){
    const hour = new Date().getHours();

    document.querySelectorAll(".menu-category").forEach(card => {
        card.classList.remove("active-card");
    })

    document.getElementById("breakfast-status").innerText = "";
    document.getElementById("lunch-status").innerText = "";
    document.getElementById("snacks-status").innerText = "";
    document.getElementById("dinner-status").innerText = "";

    if(hour >= 7 && hour < 9){
        document.getElementById("breakfast-card").classList.add("active-card");
        document.getElementById("breakfast-status").innerText = "Active Now";
    }
    else if(hour >= 12 && hour < 14){
        document.getElementById("lunch-card").classList.add("active-card");
        document.getElementById("lunch-status").innerText = "Active Now";
    }
    else if(hour >= 16 && hour < 17){
        document.getElementById("snacks-card").classList.add("active-card");
        document.getElementById("snacks-status").innerText = "Active Now";
    }
    else if(hour >= 19 && hour < 21){
        document.getElementById("dinner-card").classList.add("active-card");
        document.getElementById("dinner-status").innerText = "Active Now";
    }
}

let cart =[];

function addToCart(name, price){
    const item = cart.find(product => product.name == name);

    if(item){
        item.quantity++;
    }else{
        cart.push({
            name,
            price, 
            quantity:1 
        });
    }

    displayCart();
}

function displayCart(){
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        cartItems.innerHTML += `
        <div class="cart-item">

            <div>
                <h3>${item.name}</h3>
                <p>₹${item.price} each</p>
            </div>

            <div class="quantity">

                <button onclick="decreaseQuantity('${item.name}')">-</button>

                <span>${item.quantity}</span>

                <button onclick="increaseQuantity('${item.name}')">+</button>

            </div>

        </div>
        `;
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    document.getElementById("subtotal").innerText = "₹" + subtotal;
    document.getElementById("tax").innerText = "₹" + tax.toFixed(2);
    document.getElementById("total").innerText = "₹" + total.toFixed(2);
}

function increaseQuantity(name){
    const item = cart.find(product=>product.name===name);
    item.quantity++;
    displayCart();
}

function decreaseQuantity(name){

    const item = cart.find(product=>product.name===name);

    item.quantity--;

    if(item.quantity===0){

        cart = cart.filter(product=>product.name!==name);

    }

    displayCart();

}

async function payNow() {

  let method = document.querySelector('input[name="pay"]:checked').value;

  let subtotal = parseFloat(document.getElementById("subtotal").innerText.replace("₹", ""));
  let tax = parseFloat(document.getElementById("tax").innerText.replace("₹", ""));
  let total = parseFloat(document.getElementById("total").innerText.replace("₹", ""));

   let userName = localStorage.getItem("userName");
   console.log(userName);

  let items = cart.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  let data = {
    name: userName,
    items,
    subtotal,
    tax,
    amount: total,
    method
  };

  try {
    let res = await fetch("http://localhost:5000/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    let result = await res.json();

    alert(result.message);

    cart = [];
    displayCart();
    closePayment();
    loadHistory();

  } catch (error) {
    console.log(error);
    alert("Payment failed!");
  }
}

function openPayment() {
    document.getElementById("payment-modal").style.display = "flex";

    // cart items show in modal
    let paymentItems = document.getElementById("payment-items");
    paymentItems.innerHTML = "";

    cart.forEach(item => {
        paymentItems.innerHTML += `
            <p>${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</p>
        `;
    });

    // total set karo
    let total = document.getElementById("total").innerText;
    document.getElementById("payment-total").innerText = total;
}

function closePayment() {
    document.getElementById("payment-modal").style.display = "none";
}

async function loadHistory(){
    const userName = localStorage.getItem("userName");
    console.log("Username:", userName);

    const res = await fetch(`http://localhost:5000/payment/${userName}`);
    console.log("Status:", res.status);

    const payments = await res.json();
     console.log("Payments:", payments);

    const tbody = document.getElementById("history-body");
    tbody.innerHTML="";

    payments.forEach(payment => {
        let items = payment.items.map(item => `${item.name} × ${item.quantity}`)
        .join(", ");

        let date = new Date(payment.date).toLocaleDateString("en-IN");

        tbody.innerHTML += `
            <tr>
                <td>${date}</td>
                <td>${items}</td>
                <td>₹${payment.amount}</td>
                <td>${payment.method}</td>
            </tr>
        `;
    })
}

async function loadMessMenu() {

    try {

        const response = await fetch("http://localhost:5000/get-menu");
        const menu = await response.json();

        const table = document.getElementById("mess-table");

        table.innerHTML = "";

        menu.forEach(item => {

            table.innerHTML += `
                <tr>
                    <td>${item.day}</td>
                    <td>${item.breakfast || "-"}</td>
                    <td>${item.lunch || "-"}</td>
                    <td>${item.snacks || "-"}</td>
                    <td>${item.dinner || "-"}</td>
                </tr>
            `;

        });

    } catch (err) {

        console.log(err);

    }

}

window.onload = function () {
    loadSidebar();
    showCurrentDate();
    updateMealStatus();
    loadHistory();
    loadMessMenu();
};