import { addToCart, cart, updateCartCount } from "./cart.js";

const header = document.querySelector("header");
const nav = document.querySelector("nav");
const aboutInfo = document.querySelector(".about-info");
const navLinks = document.querySelector(".navlinks");

let aboutInfoVisible = false;

function updateNav() {
  const mobileMenuOpen =
    document.querySelector(".navlinks").getAttribute("data-visible") === "true";
  if (mobileMenuOpen) return;

  if (navLinks.getAttribute("data-visible") === "true") return;

  if (window.scrollY > 50 && !aboutInfoVisible) {
    // Scrolled in dark section - solid black with white text
    nav.classList.add("nav-dark");
    header.classList.add("scrolled");
  } else if (aboutInfoVisible) {
    // Over about-info section - white background with black text
    nav.classList.remove("nav-dark");
    // header.classList.remove("scrolled");
  } else {
    // At top - transparent with white text
    nav.classList.add("nav-dark");
    header.classList.remove("scrolled");
  }
}

// Intersection Observer for about-info section
if (aboutInfo) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        aboutInfoVisible = entry.isIntersecting;
        updateNav();
      });
    },
    { threshold: 0.9 }
  );
  observer.observe(aboutInfo);
}

// Update nav on scroll
window.addEventListener("scroll", updateNav);

// Initial state
updateNav();
document.addEventListener("DOMContentLoaded", updateCartCount);
