let products = [];
let filteredProducts = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

async function loadProducts() {
  loading.hidden = false;
  error.hidden = true;

  try {
    const cachedProducts = localStorage.getItem("products");

    if (cachedProducts) {
      products = JSON.parse(cachedProducts);
    } else {
      products = await fetchProducts();
      localStorage.setItem("products", JSON.stringify(products));
    }

    filteredProducts = [...products];

    createCategoryOptions();
    renderProducts();
  } catch (err) {
    error.hidden = false;
    productGrid.innerHTML = "";
  } finally {
    loading.hidden = true;
  }
}

function createCategoryOptions() {
  const categories = [...new Set(products.map(product => product.category))];

  categoryFilter.innerHTML = `
    <option value="all">All Categories</option>
    ${categories
      .map(category => `<option value="${category}">${category}</option>`)
      .join("")}
  `;
}

function renderProducts() {
  productGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img
        src="${product.image}"
        alt="${product.title}"
        width="150"
        height="150"
        loading="lazy"
      >

      <h2>${product.title}</h2>

      <p>${product.category}</p>

      <p class="price">$${product.price.toFixed(2)}</p>

      <p>Rating: ${product.rating.rate} / 5</p>
    `;

    productGrid.appendChild(card);
  });
}

function updateProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortSelect.value;

  filteredProducts = products.filter(product => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (selectedSort === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (selectedSort === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (selectedSort === "name") {
    filteredProducts.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  renderProducts();
}

searchInput.addEventListener("input", updateProducts);
categoryFilter.addEventListener("change", updateProducts);
sortSelect.addEventListener("change", updateProducts);

loadProducts();
