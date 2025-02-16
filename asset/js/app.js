document.addEventListener("DOMContentLoaded", () => {
  const icon = document.querySelector("i.icon");
  const cartEl = document.querySelector(".cart");
  const closeBtn = document.querySelector(".btn.close");
  const shop = document.querySelector(".shop");
  let products = [];
  let cartItems = [];

  // Toggle the cart display
  const toggleCart = () => {
    cartEl.classList.toggle("active");
  };

  icon.addEventListener("click", toggleCart);
  closeBtn.addEventListener("click", toggleCart);

  // Render the list of products to the shop
  const renderProducts = (products) => {
    shop.innerHTML = "";
    products.forEach((product) => {
      const itemEl = document.createElement("div");
      itemEl.dataset.id = product.id;
      itemEl.classList.add("item");
      itemEl.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="name">${product.name}</div>
        <div class="price">${product.prices}</div>
        <button class="add-to-cart">Add to Cart</button>
      `;
      shop.appendChild(itemEl);
    });
  };

  // Add product to cart logic
  const addToCart = (productId) => {
    const index = cartItems.findIndex((item) => item.product_id === productId);
    if (index === -1) {
      cartItems.push({ product_id: productId, quantity: 1 });
    } else {
      cartItems[index].quantity += 1;
    }
    updateCartUI();
    saveCart();
  };

  // Update the UI to reflect the current cartItems
  const updateCartUI = () => {
    // Implement your cart UI update logic here
    console.log("Cart Items:", cartItems);
  };

  // Save the current cart to localStorage
  const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };

  // Load the cart from localStorage on initialization
  const loadCart = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cartItems = JSON.parse(storedCart);
      updateCartUI();
    }
  };

  // Event delegation for adding items to the cart
  shop.addEventListener("click", (event) => {
    const addBtn = event.target.closest(".add-to-cart");
    if (addBtn) {
      const productEl = addBtn.closest(".item");
      const productId = productEl.dataset.id;
      addToCart(productId);
    }
  });

  // Initialize the app: fetch products and load cart data
  const initApp = async () => {
    try {
      const response = await fetch("../../products.json");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      products = await response.json();
      renderProducts(products);
      loadCart();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  };

  initApp();
});
