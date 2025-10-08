// import { flashMessage } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  // Show user info
  document.getElementById("profileName").textContent = currentUser.name;
  document.getElementById("profileEmail").textContent = currentUser.email;

  // Get users
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === currentUser.email);

  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = "";

  if (!user.orders || user.orders.length === 0) {
    ordersList.innerHTML = "<p>No orders yet.</p>";
  } else {
    user.orders.forEach((order) => {
      const div = document.createElement("div");
      div.classList.add("order");

      div.innerHTML = `
        <h4>Order #${order.id}</h4>
        <p>Date: ${order.date}</p>
        <p>Total: ₦${order.total.toLocaleString()}</p>
        <ul>
          ${order.items
            .map(
              (item) => `
            <li>${item.name} (${item.size || "N/A"}) × ${item.quantity}</li>
          `
            )
            .join("")}
        </ul>
        <hr>
      `;
      ordersList.appendChild(div);
    });
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
});
