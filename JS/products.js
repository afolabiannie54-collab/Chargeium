import { products } from "./productdata.js";
import { addToCart, cart, updateCartCount } from "./cart.js";

const grid = document.getElementById("product-grid");
const indexGrid = document.getElementById("indexGrid");
const searchInput = document.getElementById("search-input");
const isfilter = document.querySelector(".shop-filter-bar");

const featuredProducts = products.slice(0, 12);

function renderProducts(productList, container, showViewButton = true) {
  if (!container) return;

  container.innerHTML = "";

  if (productList.length === 0) {
    const message = document.createElement("div");
    message.classList.add("no-products");
    message.textContent = "No products found.";
    container.appendChild(message);

    container.classList.add("empty-grid");
    return;
  }

  container.classList.remove("empty-grid");

  productList.forEach((product) => {
    if (!product.name) return;

    const div = document.createElement("div");
    div.classList.add("product");

    const onIndex =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/" ||
      window.location.pathname === "/index";

    div.innerHTML = `
      <img
        src="${product.images[0]}"
        alt="${product.name}"
        width="300"
        height="400"
        loading="lazy"
      />
      <div class="productinfo">
        <h3>${product.name.toUpperCase()}</h3>
        <p>₦${product.price.toLocaleString()}</p>
        <button class="btn btn-secondary addtocart" data-id="${product.id}">
          ADD TO CART
        </button>
         ${
           showViewButton
             ? `<a href="${onIndex ? "html/" : ""}product.html?id=${
                 product.id
               }" class="btn btn-secondary">VIEW PRODUCT</a>`
             : ""
         }
      </div>
    `;

    container.appendChild(div);
  });
}

renderProducts(featuredProducts, indexGrid, true);

renderProducts(products, grid, true);

if (!window.location.pathname.includes("product.html")) {
  const modal = document.getElementById("addToCartModal");
  const closeBtn = modal.querySelector(".close");
  const sizeSelect = document.getElementById("modalSizeSelect");
  const productNameEl = document.getElementById("modalProductName");
  const confirmBtn = document.getElementById("confirmAddToCart");

  const stepSelect = document.getElementById("modalStepSelect");
  const stepConfirm = document.getElementById("modalStepConfirm");
  const confirmText = document.getElementById("modalConfirmText");
  const continueBtn = document.getElementById("continueShopping");

  let selectedProductId = null;

  // Handle grid Add to Cart clicks
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("addtocart")) {
      const productId = e.target.dataset.id;
      const product = products.find((p) => p.id == productId);

      if (!product) return;

      selectedProductId = productId;

      // Reset modal to Step 1
      stepSelect.style.display = "block";
      stepConfirm.style.display = "none";

      // Set product name
      productNameEl.textContent = product.name;

      // Populate size dropdown
      sizeSelect.innerHTML = "";
      if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach((size) => {
          const option = document.createElement("option");
          option.value = size;
          option.textContent = size;
          sizeSelect.appendChild(option);
        });
      } else {
        // no sizes → hide select, auto-handle
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "One Size";
        sizeSelect.appendChild(option);
      }

      modal.style.display = "block";
    }
  });

  // Close modal (X)
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Confirm Add to Cart
  confirmBtn.addEventListener("click", () => {
    const selectedSize = sizeSelect.value || null;

    addToCart(selectedProductId, selectedSize);

    // Switch to Step 2
    stepSelect.style.display = "none";
    stepConfirm.style.display = "block";
    confirmText.textContent = `✓ ${
      products.find((p) => p.id == selectedProductId).name
    } (${selectedSize || "One Size"}) has been added to your cart.`;
  });

  // Continue Shopping button
  continueBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Optional: Close modal if clicked outside content
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filteredProducts = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      });

      grid.innerHTML = "";
      renderProducts(filteredProducts, grid, true);
    });
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);

if (window.location.pathname.includes("product.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find((p) => p.id == id);
  const sizeSelect = document.getElementById("size");
  const sizeContainer = document.querySelector(".sizecontainer");

  if (product) {
    console.log("Rendering product details for:", product);
    document.getElementById("productName").textContent =
      product.name.toUpperCase();
    document.getElementById("productPrice").textContent =
      "₦" + product.price.toLocaleString();
    document.getElementById("productDescription").textContent =
      product.description;

    if (product.images && product.images.length > 0) {
      document.getElementById("productImageMain").src = product.images[1];
      if (product.images[1]) {
        document.getElementById("productImageAlt").src =
          product.images[2] || product.images[0];
      }

      if (sizeSelect && product.sizes) {
        sizeSelect.innerHTML = "";
        product.sizes.forEach((size) => {
          const option = document.createElement("option");
          option.value = size;
          option.textContent = size;
          sizeSelect.appendChild(option);
        });
      } else {
        sizeContainer.remove();
      }
    }

    document.getElementById("addToCartBtn").addEventListener("click", () => {
      addToCart(product.id, sizeSelect ? sizeSelect.value : null);
    });

    const relatedGrid = document.getElementById("relatedgrid");
    if (relatedGrid) {
      const related = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      relatedGrid.innerHTML = "";
      renderProducts(related, relatedGrid, true);
    }
  } else {
    document.querySelector("main").innerHTML = "<h2>Product not found</h2>";
  }
}

if (isfilter) {
  const categorySelect = document.getElementById("category");
  const sortSelect = document.getElementById("sort");
  const genderSelect = document.getElementById("gender");
  function applyFilters() {
    const selectedCategory = document.getElementById("category").value;
    const selectedPrice = document.getElementById("sort").value;
    const selectedGender = document.getElementById("gender").value;

    const params = new URLSearchParams(window.location.search);
    const genderParam = params.get("gender");

    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedGender !== "all") {
      filtered = filtered.filter(
        (product) => product.gender === selectedGender
      );
    }

    if (genderParam) {
      filtered = filtered.filter((product) => product.gender === genderParam);
      genderSelect.value = genderParam;
    }

    if (selectedPrice === "price-low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedPrice === "price-high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }
    grid.innerHTML = "";
    renderProducts(filtered, grid, true);
  }

  applyFilters();

  categorySelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);
  genderSelect.addEventListener("change", applyFilters);
}
