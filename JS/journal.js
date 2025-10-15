import { products } from "./productdata.js";

const journalGrid = document.getElementById("journalGrid");

// Shuffle the array (Fisher-Yates shuffle)
const shuffledProducts = [...products].sort(() => Math.random() - 0.5);

shuffledProducts.forEach((product) => {
  const item = document.createElement("div");
  item.classList.add("journal-item");

  const defaultImage = product.images[1] || product.images[0];
  const hoverImage = product.images[2] || defaultImage;

  item.innerHTML = `
    <a href="product.html?id=${product.id}">
      <div class="journal-image-wrapper">
        <img src="${defaultImage}" alt="${product.name}" class="journal-img main-img">
        <img src="${hoverImage}" alt="${product.name} hover" class="journal-img hover-img">
      </div>
    </a>
  `;

  journalGrid.appendChild(item);
});
