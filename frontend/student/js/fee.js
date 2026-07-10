function closeModal(){
    document.getElementById("pay-modal").style.display = "none";
}

async function confirmPayment(){
    const studentId = localStorage.getItem("userId");
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    if(!paymentMethod){
        alert("Select Payment method");
        return;
    }

    const receipt = document.getElementById("receipt").files[0];

    if(!receipt){
        alert("Upload payment proof");
        return;
    }

    const formData = new FormData();

    formData.append(
        "studentId",
        studentId
    );

    formData.append(
        "billId",
        document.getElementById("paymentId").value
    );

    formData.append(
        "paymentType",
        document.getElementById("paymentType").value
    );

    formData.append(
        "amount",
        document.getElementById("amount-to-pay").innerText.replace("₹","")
    );

    formData.append(
        "paymentMethod",
        paymentMethod.value
    );

    formData.append(
        "proof",
        receipt
    );

    const res = await fetch(
        "http://localhost:5000/pay-bill",
        {
            method:"POST",
            body:formData
        }
    );

    const result = await res.json();
    console.log(result);
    alert(result.message);
    closeModal();
}

async function loadFeeStructure() {
    try {
        const studentId = localStorage.getItem("userId");

        const feeRes = await fetch("http://localhost:5000/fee-structure");
        console.log("Fee Response:", feeRes.status);
        const fee = await feeRes.json();
        console.log("Fee:", fee);

        console.log(fee);

        const paymentRes = await fetch(
            `http://localhost:5000/student-payments/${studentId}`
        );
        console.log("Payment Response:", paymentRes.status);

        const payments = await paymentRes.json();
        console.log("Payment:", payments);

        // Total Fee Card
        document.getElementById("totalAmount").innerText = "₹" + fee.totalFee;

        const tbody = document.getElementById("installmentTableBody");
        tbody.innerHTML = "";

        fee.installments.forEach((item, index) => {

            const dueDate = new Date(item.dueDate).toLocaleDateString("en-IN");

            // Filhal sab pending maan rahe hain
            let status = "Pending";
            let statusClass = "pending";

            let paidOn = "-";
            let method = "-";

            let actionButton = `
                <button onclick="openPaymentModal('${item._id}', ${item.amount}, 'Hostel Fee')">
                    Pay Now
                </button>
            `;

            console.log("Installment ID:", item._id.toString());

    payments.forEach(p => {
        console.log(
            "Payment billId:",
            p.billId.toString(),
            "Status:",
            p.status
        );
    });

            const payment = payments.find(
                p => p.billId.toString() === item._id.toString()
            );
            console.log("FOUND PAYMENT:", payment);

            if(payment){
                console.log("Installment", item.installmentNo, "Status:", payment.status);
                status = payment.status;
                statusClass = payment.status.toLowerCase();

                paidOn = payment.paidOn ? new Date(payment.paidOn).toLocaleDateString("en-IN"): "-";

                method = payment.paymentMethod;

                if(payment.status === "Verification"){
                    actionButton = `<button disabled>Under Verification</button>`;
                }
                else if(payment.status == "Approved"){
                    status = "Paid";
                    statusClass = "paid";

                    actionButton = `
                        <button disabled>
                            Paid
                        </button>
                    `;
                }
                else if (payment.status === "Rejected") {

                    actionButton = `
                        <button onclick="openPaymentModal('${item._id}', ${item.amount}, 'Hostel Fee')">
                            Pay Again
                        </button>
                    `;
                }
            }

            else if(index > 0){
                status = "Upcoming";
                statusClass = "upcoming";

                actionButton = `
                    <button class="disabled-btn" disabled>
                        Not Available
                    </button>
                `;
            }

            tbody.innerHTML += `
                <tr>
                    <td>Installment ${item.installmentNo}</td>
                    <td>₹${item.amount}</td>
                    <td>${dueDate}</td>
                    <td>${paidOn}</td>
                    <td>${method}</td>
                    <td>
                        <span class="${statusClass}">
                            ${status}
                        </span>
                    </td>
                    <td>${actionButton}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.log(err);
    }
}

async function loadBills() {

    const studentId = localStorage.getItem("userId");
    console.log("Student ID:", studentId);

    try {

        const res = await fetch(
            `http://localhost:5000/student-bills/${studentId}`
        );

         console.log("Response:", res.status);

        const bills = await res.json();
         console.log("Bills:", bills);

        const tbody = document.getElementById("electricityTableBody");
        console.log("tbody:", tbody);

        tbody.innerHTML = "";

        bills.forEach((bill, index) => {
            console.log("Adding:", bill);

            tbody.innerHTML += `
                <tr>
                    <td>${bill.month}</td>
                    <td>${bill.previousReading}</td>
                    <td>${bill.currentReading}</td>
                    <td>${bill.unitConsumed}</td>
                    <td>₹${bill.billAmount}</td>
                    <td>${new Date(bill.dueDate).toLocaleDateString("en-IN")}</td>
                    <td>
                        <span class="${bill.status.trim().toLowerCase()}">
                            ${bill.status}
                        </span>
                    </td>
                    <td>
                        ${
                            bill.status === "Pending"
        ? `<button onclick="openPaymentModal('${bill._id}', ${bill.billAmount}, 'Electricity Bill')">
                Pay Now
           </button>`

        : bill.status === "Verification"
        ? `<button disabled>
                Under Verification
           </button>`

        : bill.status === "Rejected"
        ? `<button onclick="openPaymentModal('${bill._id}', ${bill.billAmount}, 'Electricity Bill')">
                Pay Again
           </button>`

        : `<button disabled>
                Paid
           </button>`
                        }
                    </td>
                </tr>
            `;
        });

    } catch (err) {

        console.log(err);

    }

}

function showPaymentDetails() {

    let paymentInfo = document.getElementById("payment-info");

    if(document.getElementById("upi").checked){

        paymentInfo.innerHTML = `
            <div class="payment-box">
                <h4>UPI Payment</h4>
                <p><strong>UPI ID:</strong> hostelhub@okaxis</p>
                <p>Scan QR code or use the UPI ID above.</p>
            </div>
        `;
    }

    else if(document.getElementById("bank").checked){

        paymentInfo.innerHTML = `
            <div class="payment-box">
                <h4>Bank Transfer Details</h4>
                <p><strong>Account Name:</strong> HostelHub</p>
                <p><strong>Account Number:</strong> 123456789012</p>
                <p><strong>IFSC:</strong> SBIN0001234</p>
                <p><strong>Bank:</strong> State Bank of India</p>
            </div>
        `;
    }

    else if(document.getElementById("cash").checked){

        paymentInfo.innerHTML = `
            <div class="payment-box">
                <h4>Cash Deposit</h4>
                <p>Please visit the hostel office counter and deposit the amount.</p>
                <p>After payment, upload the receipt or payment proof for verification.</p>
            </div>
        `;
    }
}

function openPaymentModal(id, amount, type){
    document.getElementById("paymentId").value = id;
    document.getElementById("paymentType").value = type;
    document.getElementById("amount-to-pay").innerText = "₹" + amount;
    document.getElementById("paymentTitle").innerText =
        type + " Payment";

    document.getElementById("receipt").value = "";

    document.querySelectorAll('input[name="payment"]').forEach(r => {
        r.checked = false;
    });

    document.getElementById("payment-info").innerHTML = "";
    document.getElementById("pay-modal").style.display = "flex";
}

let paymentHistory = [];

async function loadHistory(){
    const studentId = localStorage.getItem("userId");

    const res = await fetch(
        `http://localhost:5000/student-payment-history/${studentId}`
    );
    console.log(res.status);

    paymentHistory = await res.json();
    console.log(paymentHistory);

    renderHistory(paymentHistory);
}

function renderHistory(data){
    const tbody = document.getElementById("historyTableBody");
    tbody.innerHTML = "";

    data.forEach(payment => {
        tbody.innerHTML += `
            <tr>

                <td>TXN-${payment._id.slice(-6).toUpperCase()}</td>

                <td>${new Date(payment.paidOn).toLocaleDateString("en-IN")}</td>

                <td>${payment.paymentType}</td>

                <td>₹${payment.amount}</td>

                <td>
                    <span class="${payment.status.toLowerCase()}">
                        ${payment.status}
                    </span>
                </td>

            </tr>`;
    });
}

function filterHistory(){
    const type = document.getElementById("filter-type").value;
    const status = document.getElementById("filter-status").value;

    let filtered = paymentHistory;

    if(type != "all"){
        filtered = filtered.filter(payment => {
            if(type === "installment"){
                return payment.paymentType === "Hostel Fee";
            }
            if(type === "electricity"){
                return payment.paymentType === "Electricity Bill";
            }
        });
    }

    if(status != "all"){
        filtered = filtered.filter(payment =>
            payment.status.trim().toLowerCase() === status.trim().toLowerCase()
        );
    }

    renderHistory(filtered);
}

window.onload = function () {
    loadSidebar();
    loadFeeStructure();
    loadBills();
    loadHistory();
};