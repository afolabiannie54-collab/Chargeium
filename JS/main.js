const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const primaryNav = document.querySelector(".navlinks");

mobileNavToggle.addEventListener("click", () => {
  const visibility = primaryNav.getAttribute("data-visible");

  if (visibility === "false") {
    primaryNav.setAttribute("data-visible", true);
    mobileNavToggle.setAttribute("aria-expanded", true);
    mobileNavToggle.classList.add("nav-open");
    mobileNavToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    primaryNav.setAttribute("data-visible", false);
    mobileNavToggle.setAttribute("aria-expanded", false);
    mobileNavToggle.classList.remove("nav-open");
    mobileNavToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});
