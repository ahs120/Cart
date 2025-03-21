document.addEventListener("DOMContentLoaded", () => {
  // Selecting key elements from the DOM
  const cart = document.querySelector(".cart"); // Cart container
  const icon = document.querySelector(".icon"); // Cart icon to open the cart
  const closeBtn = document.querySelector(".close"); // Button to close the cart
  const shop = document.querySelector(".shop"); // Shop container where products are displayed
  const cartList = document.querySelector(".items-lis"); // Container for cart items
  const iconText = document.querySelector(".count"); // Element to show the number of items in the cart

  let listItems = []; // Array to store items added to the cart
  let product = []; // Array to store product data from the JSON file

  // Function to toggle the cart's visibility
  const cartToggle = () => {
    cart.classList.toggle("active");
  };

  // Event listeners to open and close the cart
  icon.addEventListener("click", cartToggle);
  closeBtn.addEventListener("click", cartToggle);

  // Event listener to handle adding items to the cart
  shop.addEventListener("click", (event) => {
    const itemPosition = event.target;
    if (itemPosition.classList.contains("add-to-cart")) {
      const item_id = itemPosition.parentElement.dataset.id; // Get product ID
      addToCart(item_id); // Add product to cart
    }
  });

  // Function to add an item to the cart
  const addToCart = (item_id) => {
    const posItemInCart = listItems.findIndex((e) => e.id === item_id);

    if (posItemInCart === -1) {
      // If the item is not in the cart, add it with quantity 1
      listItems.push({ id: item_id, count: 1 });
    } else {
      // If the item is already in the cart, increase its quantity
      listItems[posItemInCart].count += 1;
    }
    addHTMLToCart(); // Update the cart UI
  };

  // Function to update the cart UI
  const addHTMLToCart = () => {
    cartList.innerHTML = ""; // Clear the current cart items
    let totalCount = 0;

    if (listItems.length > 0) {
      listItems.forEach((item) => {
        totalCount += item.count; // Update total count of items

        let newItem = document.createElement("div");
        newItem.classList.add("item");
        newItem.dataset.id = item.id;

        let positionItem = product.findIndex((value) => value.id == item.id);
        let info = product[positionItem];

        // Generate the cart item HTML
        newItem.innerHTML = `
          <img src="${info.image}" alt="item" />
          <p class="name">${info.name}</p>
          <div class="control">
            <span class="sup col" onclick="updateQuantity('${
              item.id
            }', -1)">-</span>
            <div class="quint col">${item.count}</div>
            <span class="plus col" onclick="updateQuantity('${
              item.id
            }', 1)">+</span>
          </div>
          <div class="price">${info.price * item.count}</div>
        `;

        cartList.appendChild(newItem); // Add the item to the cart list
        addMemory(); // Save cart data to local storage
      });
    }

    iconText.textContent = totalCount; // Update the cart icon count
    calculateTotal(); // Calculate and display total price
  };

  // Function to update item quantity in the cart
  window.updateQuantity = (item_id, change) => {
    const posItemInCart = listItems.findIndex((e) => e.id === item_id);

    if (posItemInCart !== -1) {
      listItems[posItemInCart].count += change;

      if (listItems[posItemInCart].count <= 0) {
        // Remove item if the quantity is zero
        listItems.splice(posItemInCart, 1);
      }

      addHTMLToCart(); // Update cart UI
      addMemory(); // Save updated cart data
      calculateTotal(); // Update total price
    }
  };

  // Function to display products in the shop
  const addToHTML = (data) => {
    shop.innerHTML = "";

    data.forEach((item) => {
      let div = document.createElement("div");
      div.classList.add("item");
      div.dataset.id = item.id;

      // Generate product HTML
      div.innerHTML = `
        <img src="${item.image}" alt="image" />
        <div class="name">${item.name}</div>
        <div class="price">${item.price}</div>
        <div class="add-to-cart">Add to Cart</div>
      `;

      shop.append(div); // Add the product to the shop
    });
  };

  // Function to save cart items to local storage
  const addMemory = () => {
    localStorage.setItem("Cart", JSON.stringify(listItems));
  };

  // Function to fetch product data from JSON file
  const getData = () => {
    fetch("../../products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        product = data; // Store product data
        addToHTML(data); // Display products in the shop

        // If cart data exists in local storage, load it
        if (localStorage.getItem("Cart")) {
          listItems = JSON.parse(localStorage.getItem("Cart"));
          addHTMLToCart();
        }
      });
  };

  getData(); // Fetch product data when the page loads

  calculateTotal(); // Calculate total price on page load

  // Add event listeners for "Add to Cart" buttons (redundant, already handled)
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addItemToCart);
  });

  // Event listener for cart item quantity changes
  const cartItems = document.querySelector(".cart .items-lis");
  cartItems.addEventListener("click", (event) => {
    if (event.target.classList.contains("sup")) {
      updateQuantity(event.target, -1);
    } else if (event.target.classList.contains("plus")) {
      updateQuantity(event.target, 1);
    }
  });
});

// Function to calculate and update the total cart price
function calculateTotal() {
  const items = document.querySelectorAll(".cart .items-lis .item");
  let total = 0;

  items.forEach((item) => {
    const priceElement = item.querySelector(".price");
    const quantityElement = item.querySelector(".quint");
    const price = parseFloat(priceElement.textContent);
    const quantity = parseInt(quantityElement.textContent, 10);
    total += price;
  });

  document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
}

// Function to handle adding an item to the cart (redundant, similar to addToCart)
function addItemToCart(event) {
  const itemElement = event.target.closest(".item");
  const itemName = itemElement.querySelector(".name").textContent;
  const itemPrice = itemElement.querySelector(".price").textContent;

  const cartItems = document.querySelector(".cart .items-lis");
  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  // Generate cart item HTML
  cartItem.innerHTML = `
    <img src="asset/image/1.png" alt="${itemName}" />
    <p class="name">${itemName}</p>
    <div class="control">
      <span class="sup col">-</span>
      <div class="quint col">1</div>
      <span class="plus col">+</span>
    </div>
    <div class="price">${itemPrice}</div>
  `;

  cartItems.appendChild(cartItem);
  calculateTotal();
}

// Function to update item quantity (redundant, already defined)
function updateQuantity(button, change) {
  const quantityElement = button.parentElement.querySelector(".quint");
  let quantity = parseInt(quantityElement.textContent, 10);
  quantity = Math.max(0, quantity + change);
  quantityElement.textContent = quantity;

  calculateTotal();
}
