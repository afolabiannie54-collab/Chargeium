const USERS_KEY = "users";
const CURRENT_KEY = "currentUser";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_KEY));
}
function setCurrentUser(user) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}
function clearCurrentUser() {
  localStorage.removeItem(CURRENT_KEY);
}

const nameRegex = /^[A-Za-z\s]{2,40}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.{8,}$)(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;

function ensureErrorEl(input) {
  let next = input.nextElementSibling;
  if (!next || !next.classList.contains("error-msg")) {
    const small = document.createElement("small");
    small.className = "error-msg";
    small.style.color = "#cf3b3b";
    small.style.fontSize = "13px";
    small.style.marginTop = "6px";
    small.style.display = "block";
    input.insertAdjacentElement("afterend", small);
    return small;
  }
  return next;
}
function showError(input, message) {
  const el = ensureErrorEl(input);
  el.textContent = message;
  input.classList.add("input-error");
}
function clearError(input) {
  const next = input.nextElementSibling;
  if (next && next.classList.contains("error-msg")) next.textContent = "";
  input.classList.remove("input-error");
}

export function flashMessage(text, type = "info", timeout = 2600) {
  const toast = document.createElement("div");
  toast.className = `mini-toast ${type}`;
  toast.textContent = text;
  Object.assign(toast.style, {
    position: "fixed",
    right: "20px",
    bottom: "24px",
    padding: "10px 14px",
    borderRadius: "8px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    zIndex: 9999,
    background: type === "error" ? "#ffeded" : "#111",
    color: type === "error" ? "#cf3b3b" : "#fff",
    fontSize: "14px",
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity 250ms ease";
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 300);
  }, timeout);
}

function updateNavbarAuth() {
  const userAnchor = document.querySelector('a[aria-label="User account"]');
  if (!userAnchor) return;

  const current = getCurrentUser();
  const onIndex =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "/index";

  if (current) {
    const profileLink = onIndex ? "html/profile.html" : "profile.html";
    userAnchor.setAttribute("href", profileLink);
    userAnchor.classList.add("auth-user");
    userAnchor.innerHTML = `
      <span class="nav-user">Hi, ${escapeHtml(
        current.name.split(" ")[0]
      )}</span>
      <i class="fa-solid fa-user"></i>
    `;
  } else {
    const loginLink = onIndex ? "HTML/login.html" : "login.html";
    userAnchor.classList.remove("auth-user");
    userAnchor.innerHTML = `<i class="fa-solid fa-user"></i>`;
    userAnchor.setAttribute("href", loginLink);
  }
}
function escapeHtml(unsafe) {
  return unsafe.replace(
    /[&<"']/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", '"': "&quot;", "'": "&#039;" }[m])
  );
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  const nameInput = document.getElementById("signupName");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const confirmInput = document.getElementById("signupConfirm");

  [nameInput, emailInput, passwordInput, confirmInput].forEach(
    (el) => el && el.addEventListener("input", () => clearError(el))
  );

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    [nameInput, emailInput, passwordInput, confirmInput].forEach((el) =>
      clearError(el)
    );

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    let ok = true;
    if (!name || !nameRegex.test(name)) {
      showError(nameInput, "Enter a real name (letters & spaces, 2–40 chars).");
      ok = false;
    }
    if (!email || !emailRegex.test(email)) {
      showError(emailInput, "Enter a valid email address.");
      ok = false;
    }
    if (!password || !passwordRegex.test(password)) {
      showError(
        passwordInput,
        "Password must be ≥8 chars, include 1 uppercase, 1 number and 1 special char."
      );
      ok = false;
    }
    if (password !== confirm) {
      showError(confirmInput, "Passwords do not match.");
      ok = false;
    }

    if (!ok) return;

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      showError(emailInput, "Email already registered. Try logging in.");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);

    setCurrentUser({ name, email });
    updateNavbarAuth();
    flashMessage("Account created — welcome!", "success");

    setTimeout(() => (window.location.href = "../index.html"), 700);
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  [emailInput, passwordInput].forEach(
    (el) => el && el.addEventListener("input", () => clearError(el))
  );

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError(emailInput);
    clearError(passwordInput);

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    let ok = true;
    if (!email || !emailRegex.test(email)) {
      showError(emailInput, "Enter a valid email.");
      ok = false;
    }
    if (!password || password.length < 6) {
      showError(passwordInput, "Password must be at least 6 characters.");
      ok = false;
    }
    if (!ok) return;

    const users = getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      showError(emailInput, "No user found with that email / password.");
      showError(passwordInput, "Check email or password.");
      flashMessage("Invalid credentials", "error", 2200);
      return;
    }

    setCurrentUser({ name: user.name, email: user.email });
    updateNavbarAuth();
    flashMessage(`Welcome back, ${user.name.split(" ")[0]}!`, "success");
    setTimeout(() => (window.location.href = "../index.html"), 700);
  });
}

const existingLogoutBtn = document.getElementById("logout-btn");
if (existingLogoutBtn) {
  existingLogoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearCurrentUser();
    updateNavbarAuth();
    window.location.href = "../index.html";
  });
}

document.addEventListener("DOMContentLoaded", updateNavbarAuth);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("footerContactForm");
  const thankYou = document.getElementById("footerFormThankYou");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.reset();
      thankYou.style.display = "block";
      setTimeout(() => {
        thankYou.style.display = "none";
      }, 3500);
    });
  }
});

const backToTopButton = document.getElementById("backtotop");
if (backToTopButton) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  };

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
