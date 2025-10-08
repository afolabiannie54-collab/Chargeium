import { products } from "./productdata.js";
import { flashMessage } from "./auth.js";

export let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItemsSpan = document.getElementById("cart-totalitems");
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCount) cartCount.textContent = totalQuantity;
  if (totalItemsSpan) totalItemsSpan.textContent = totalQuantity;
}

export function addToCart(productId, selectedSize) {
  const product = products.find((p) => p.id == productId);
  if (!product) return;

  const existItem = cart.find(
    (item) => item.id == productId && item.size == selectedSize
  );

  if (existItem) {
    existItem.quantity += 1;
  } else {
    cart.push({ ...product, size: selectedSize, quantity: 1 });
  }

  saveCart();
  updateCartCount();
}

export function minimizeQuantity(productId, selectedSize) {
  const item = cart.find(
    (item) => item.id == productId && item.size == selectedSize
  );
  if (!item) return;

  if (item.quantity > 1) item.quantity--;
  else removeFromCart(productId, selectedSize);

  saveCart();
  updateCartCount();
  renderCart();
}

export function maximizeQuantity(productId, selectedSize) {
  const item = cart.find(
    (item) => item.id == productId && item.size == selectedSize
  );
  if (!item) return;

  if (item.quantity < 99) item.quantity++;
  saveCart();
  updateCartCount();
  renderCart();
}

export function removeFromCart(productId, selectedSize) {
  cart = cart.filter(
    (item) => !(item.id == productId && item.size == selectedSize)
  );
  saveCart();
  updateCartCount();
  renderCart();
}

export function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function renderCart() {
  const cartTotal = document.getElementById("cart-total");
  const cartItems = document.getElementById("cart-items");

  if (!cartItems) return;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <a href="shop.html" class="btn">Continue Shopping</a>
      </div>
    `;
    if (cartTotal) cartTotal.textContent = "0";
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.images[0]}" alt="${
      item.name
    }" width="100" height="100" />
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        ${item.size ? `<p>Size: ${item.size}</p>` : ""}
        <p>₦${item.price.toLocaleString()}</p>
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-id="${item.id}" data-size="${
      item.size
    }">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}" data-size="${
      item.size
    }">+</button>
        </div>
      </div>
      <button class="remove-btn" data-id="${item.id}" data-size="${item.size}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    cartItems.appendChild(div);
  });

  if (cartTotal) cartTotal.textContent = getCartTotal().toLocaleString();
}

function setupCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  const openBtn = document.querySelector(".checkout-btn");
  const closeBtn = document.getElementById("closeCheckoutModal");
  const checkoutForm = document.getElementById("checkoutForm");

  if (!modal || !openBtn || !checkoutForm) return;

  openBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      flashMessage("Your cart is empty.", "error");
      return;
    }
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  closeBtn?.addEventListener("click", () => closeModal());
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("checkout-name").value.trim();
    const email = document.getElementById("checkout-email").value.trim();
    const phone = document.getElementById("checkout-phone").value.trim();
    const address = document.getElementById("checkout-address").value.trim();
    const card = document.getElementById("checkout-card").value.trim();
    const expiry = document.getElementById("checkout-expiry").value.trim();
    const cvv = document.getElementById("checkout-cvv").value.trim();

    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;
    const cardRegex = /^\d{13,19}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3,4}$/;

    if (!nameRegex.test(name))
      return flashMessage("Enter a valid name.", "error");
    if (!emailRegex.test(email))
      return flashMessage("Enter a valid email.", "error");
    if (!phoneRegex.test(phone))
      return flashMessage("Enter a valid phone number.", "error");
    if (!address) return flashMessage("Address cannot be empty.", "error");
    if (!cardRegex.test(card))
      return flashMessage("Invalid card number.", "error");
    if (!expiryRegex.test(expiry))
      return flashMessage("Invalid expiry format (MM/YY).", "error");
    if (!cvvRegex.test(cvv)) return flashMessage("Invalid CVV.", "error");

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      flashMessage("Please log in to complete checkout.", "error");
      setTimeout(() => (window.location.href = "login.html"), 1200);
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === user.email);
    if (userIndex === -1) {
      flashMessage("User not found.", "error");
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: [...cart],
      total: getCartTotal(),
      date: new Date().toLocaleString(),
      delivery: { name, email, phone, address },
    };

    users[userIndex].orders = users[userIndex].orders || [];
    users[userIndex].orders.push(newOrder);
    localStorage.setItem("users", JSON.stringify(users));

    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    closeModal();
    flashMessage("Order placed successfully!", "success");
    setTimeout(() => (window.location.href = "profile.html"), 1500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  setupCheckoutModal();
});

document.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const size = button.dataset.size;
  if (!id) return;

  if (button.classList.contains("minus")) minimizeQuantity(id, size);
  if (button.classList.contains("plus")) maximizeQuantity(id, size);
  if (button.classList.contains("remove-btn")) removeFromCart(id, size);
});
