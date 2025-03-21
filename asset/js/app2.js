class ShoppingCart {
  constructor() {
    this.cart = document.querySelector(".cart");
    this.cartIcon = document.querySelector(".icon");
    this.closeBtn = document.querySelector(".close");
    this.shop = document.querySelector(".shop");
    this.cartList = document.querySelector(".items-lis");
    this.iconText = document.querySelector(".count");
    this.totalAmount = document.getElementById("totalAmount");

    this.products = []; // Store fetched products
    this.cartItems = JSON.parse(localStorage.getItem("Cart")) || []; // Load saved cart

    this.init();
  }

  // Initialize event listeners and fetch products
  init() {
    this.cartIcon.addEventListener("click", () => this.toggleCart());
    this.closeBtn.addEventListener("click", () => this.toggleCart());
    this.shop.addEventListener("click", (event) => this.handleAddToCart(event));
    this.cartList.addEventListener("click", (event) =>
      this.handleCartActions(event)
    );

    this.fetchProducts();
    this.updateCartUI();
  }

  // Toggle cart visibility
  toggleCart() {
    this.cart.classList.toggle("active");
  }

  // Fetch product data from JSON file
  async fetchProducts() {
    try {
      const response = await fetch("../../products.json");
      if (!response.ok) throw new Error("Failed to fetch products");
      this.products = await response.json();
      this.renderProducts();
    } catch (error) {
      console.error(error);
    }
  }

  // Render products in the shop section
  renderProducts() {
    this.shop.innerHTML = this.products
      .map(
        (item) => `
      <div class="item" data-id="${item.id}">
        <img src="${item.image}" alt="image" />
        <div class="name">${item.name}</div>
        <div class="price">$${item.price.toFixed(2)}</div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `
      )
      .join("");
  }

  // Handle Add to Cart button clicks
  handleAddToCart(event) {
    if (event.target.classList.contains("add-to-cart")) {
      const itemId = event.target.closest(".item").dataset.id;
      this.addToCart(itemId);
    }
  }

  // Add item to cart
  addToCart(itemId) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      this.cartItems.push({ id: itemId, count: 1 });
    } else {
      this.cartItems[itemIndex].count++;
    }

    this.updateCartUI();
    this.saveCart();
  }

  // Handle cart actions (increase, decrease quantity)
  handleCartActions(event) {
    const target = event.target;
    const itemId = target.closest(".item")?.dataset.id;

    if (!itemId) return;

    if (target.classList.contains("sup")) {
      this.updateQuantity(itemId, -1);
    } else if (target.classList.contains("plus")) {
      this.updateQuantity(itemId, 1);
    }
  }

  // Update quantity of an item
  updateQuantity(itemId, change) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      this.cartItems[itemIndex].count += change;
      if (this.cartItems[itemIndex].count <= 0) {
        this.cartItems.splice(itemIndex, 1);
      }
      this.updateCartUI();
      this.saveCart();
    }
  }

  // Update cart UI
  updateCartUI() {
    this.cartList.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;

    this.cartItems.forEach((item) => {
      const product = this.products.find((p) => p.id == item.id);
      if (!product) return;

      totalItems += item.count;
      totalPrice += product.price * item.count;

      const cartItem = document.createElement("div");
      cartItem.classList.add("item");
      cartItem.dataset.id = item.id;

      cartItem.innerHTML = `
        <img src="${product.image}" alt="item" />
        <p class="name">${product.name}</p>
        <div class="control">
          <span class="sup col">-</span>
          <div class="quint col">${item.count}</div>
          <span class="plus col">+</span>
        </div>
        <div class="price">$${(product.price * item.count).toFixed(2)}</div>
      `;

      this.cartList.appendChild(cartItem);
    });

    this.iconText.textContent = totalItems;
    this.totalAmount.textContent = `$${totalPrice.toFixed(2)}`;
  }

  // Save cart to local storage
  saveCart() {
    localStorage.setItem("Cart", JSON.stringify(this.cartItems));
  }
}

// Initialize the shopping cart
document.addEventListener("DOMContentLoaded", () => new ShoppingCart());
