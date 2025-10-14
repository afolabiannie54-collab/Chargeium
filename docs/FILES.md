Chargeium — File map

This document explains the main files and folders in the repository to help graders and future contributors quickly find important code.

- index.html — Home page (entry point). Contains hero, featured products and contact form.
- README.md — Project overview and simple run instructions.
- LICENSE — Project license (MIT).

Folders:

- `HTML/` — Static pages used on the site:
  - `shop.html` — Shop listing and product filters
  - `product.html` — Individual product details page
  - `cart.html` — Shopping cart page
  - `about.html`, `journal.html`, `search.html`, `login.html`, `signup.html`, `profile.html`

- `CSS/` — Stylesheets:
  - `index.css` — Styles for the home page and shared variables
  - `shop.css`, `cart.css`, `auth.css`, `about.css`, `journal.css`, `search.css` — page-specific styles
  - `hover.css` — hover effect utilities used across the site

- `JS/` — JavaScript source files:
  - `main.js` — general UI helpers, back-to-top, mobile nav toggle, footer form handling
  - `products.js` — renders product grids on pages and wires product click events
  - `productdata.js` — static product dataset (images, titles, prices, sizes)
  - `cart.js` — cart logic (add/remove, count, storage) and cart page wiring
  - `auth.js` — client-side auth UI helpers
  - `index.js`, `journal.js`, `profile.js`, `animations.js` — page/feature scripts

- `assets/` — images used by pages (product and hero images)

If you need to change the product list, edit `JS/productdata.js`. If you want to add page-specific behavior, add or modify the matching `JS/` file and link it from the page.
