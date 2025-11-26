/* ============================================================
   MOBILE NAV MENU
============================================================ */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.style.display =
      navLinks.style.display === "flex" ? "none" : "flex";
  });
}

/* ============================================================
   CART COUNT (GLOBAL)
============================================================ */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = cart.length;
}

updateCartCount();

/* ============================================================
   FETCH PRODUCT DATA
============================================================ */
async function getProducts() {
  const response = await fetch("data/products.json");
  return await response.json();
}

/* ============================================================
   FEATURED PRODUCTS ON HOMEPAGE
============================================================ */
async function loadFeaturedProducts() {
  const container = document.getElementById("featuredProducts");
  if (!container) return;

  const products = await getProducts();

  // Take first 3 as "featured"
  const featured = products.slice(0, 3);

  featured.forEach(product => {
    container.innerHTML += `
      <div class="product-card" onclick="window.location='product.html?id=${product.id}'">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <button class="add-btn" onclick="addToCart(event, ${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

loadFeaturedProducts();

/* ============================================================
   ADD TO CART FUNCTION
============================================================ */
function addToCart(event, productId) {
  event.stopPropagation(); // Prevent clicking card from opening product page

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(productId);

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/* ============================================================
   LOAD PRODUCTS ON products.html
============================================================ */
async function loadAllProducts() {
  const container = document.getElementById("allProducts");
  if (!container) return;

  const products = await getProducts();

  products.forEach(product => {
    container.innerHTML += `
      <div class="product-card" onclick="window.location='product.html?id=${product.id}'">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <button class="add-btn" onclick="addToCart(event, ${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

loadAllProducts();

/* ============================================================
   LOAD A SINGLE PRODUCT (product.html)
============================================================ */
async function loadSingleProduct() {
  const productContainer = document.getElementById("productPage");
  if (!productContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const products = await getProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    productContainer.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  productContainer.innerHTML = `
    <div class="single-product">
      <img class="product-image-large" src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="price">$${product.price}</p>
        <p class="desc">${product.description}</p>
        <button class="add-btn" onclick="addToCart(event, ${product.id})">Add to Cart</button>
      </div>
    </div>
  `;
}

loadSingleProduct();

/* ============================================================
   CATEGORY PAGE (category.html)
============================================================ */
async function loadCategoryPage() {
  const container = document.getElementById("categoryProducts");
  const title = document.getElementById("categoryTitle");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const category = params.get("cat");

  const products = await getProducts();
  const filtered = products.filter(p => p.category === category);

  title.textContent = category;

  filtered.forEach(product => {
    container.innerHTML += `
      <div class="product-card" onclick="window.location='product.html?id=${product.id}'">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <button class="add-btn" onclick="addToCart(event, ${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

loadCategoryPage();
/* ============================================================
   SHOPPING CART SYSTEM
============================================================ */

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart badge globally
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const cart = getCart();
  if (cartCount) cartCount.textContent = cart.length;
}

// Render cart page (cart.html)
function renderCart() {
  const cartContainer = document.getElementById("cartContainer");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartContainer) return;

  const products = JSON.parse(localStorage.getItem("productsData")) || [];
  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "$0.00";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach((id, index) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    html += `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-info">
          <h3>${product.name}</h3>
          <p class="price">$${product.price}</p>
          <div class="quantity-controls">
            <button onclick="removeFromCart(${index})">Remove</button>
          </div>
        </div>
      </div>
    `;
    total += product.price;
  });

  cartContainer.innerHTML = html;
  cartTotal.textContent = "$" + total.toFixed(2);
}

// Add item to cart (from script.js)
function addToCart(event, productId) {
  event.stopPropagation(); // prevent card click
  const cart = getCart();
  cart.push(productId);
  saveCart(cart);
  renderCart();
}

// Remove item from cart
function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Save products data to localStorage for cart reference
async function saveProductsData() {
  const response = await fetch("data/products.json");
  const data = await response.json();
  localStorage.setItem("productsData", JSON.stringify(data));
}

// Initialize cart system
saveProductsData();
updateCartCount();
renderCart();
