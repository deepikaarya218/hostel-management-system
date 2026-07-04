function payInstallment(no){
    document.getElementById("pay-modal").style.display = "flex";
}

function closeModal(){
    document.getElementById("pay-modal").style.display = "none";
}

function confirmPayment(){
    alert("Payment submitted for verification.");
    closeModal();
}

async function loadFeeStructure() {
    try {
        const res = await fetch("http://localhost:5000/fee-structure");
        const fee = await res.json();

        console.log(fee);

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
                <button onclick="payInstallment(${item.installmentNo})">
                    Pay Now
                </button>
            `;

            if(index > 0){
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

function showPaymentDetails() {

    let paymentInfo = document.getElementById("payment-info");

    if(document.getElementById("upi").checked){

        paymentInfo.innerHTML = `
            <div class="payment-box">
                <h4>UPI Payment</h4>
                <p><strong>UPI ID:</strong> hostelhub@okaxis</p>
                <img src="../qr.jpg" alt="QR Code" width="180">
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

window.onload = function () {
    loadSidebar();
    loadFeeStructure();
};