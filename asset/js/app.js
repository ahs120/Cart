document.addEventListener("DOMContentLoaded", () => {
  const cart = document.querySelector(".cart");
  const icon = document.querySelector(".icon");
  const closeBtn = document.querySelector(".close");
  const shop = document.querySelector(".shop");
  const cartList = document.querySelector(".items-lis");
  const iconText = document.querySelector(".count");
  let listItems = [];
  let product = [];

  const cartToggle = () => {
    cart.classList.toggle("active");
  };

  icon.addEventListener("click", cartToggle);
  closeBtn.addEventListener("click", cartToggle);

  shop.addEventListener("click", (event) => {
    const itemPosition = event.target;
    if (itemPosition.classList.contains("add-to-cart")) {
      const item_id = itemPosition.parentElement.dataset.id;
      addToCart(item_id);
    }
  });

  const addToCart = (item_id) => {
    const posItemInCart = listItems.findIndex((e) => e.id === item_id);

    if (posItemInCart === -1) {
      listItems.push({ id: item_id, count: 1 });
    } else {
      listItems[posItemInCart].count += 1;
    }
    addHTMLToCart();
  };

  const addHTMLToCart = () => {
    cartList.innerHTML = "";
    let totalCount = 0;
    if (listItems.length > 0) {
      listItems.forEach((item) => {
        totalCount += item.count;
        let newItem = document.createElement("div");
        newItem.classList.add("item");
        newItem.dataset.id = item.id;
        let positionItem = product.findIndex((value) => value.id == item.id);
        let info = product[positionItem];
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
        cartList.appendChild(newItem);
        addMemory();
      });
    }
    iconText.textContent = totalCount;
    calculateTotal();
  };
  window.updateQuantity = (item_id, change) => {
    const posItemInCart = listItems.findIndex((e) => e.id === item_id);
    if (posItemInCart !== -1) {
      listItems[posItemInCart].count += change;
      if (listItems[posItemInCart].count <= 0) {
        listItems.splice(posItemInCart, 1);
      }
      addHTMLToCart();
      addMemory();
      calculateTotal();
    }
  };
  const addToHTML = (data) => {
    shop.innerHTML = "";
    data.forEach((item) => {
      let div = document.createElement("div");
      div.classList.add("item");
      div.dataset.id = item.id;
      div.innerHTML = `
        <img src="${item.image}" alt="image" />
        <div class="name">${item.name}</div>
        <div class="price">${item.price}</div>
        <div class="add-to-cart">Add to Cart</div>
      `;
      shop.append(div);
    });
  };

  const addMemory = () => {
    localStorage.setItem("Cart", JSON.stringify(listItems));
  };
  const getData = () => {
    fetch("../../products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        product = data;
        addToHTML(data);
        if (localStorage.getItem("Cart")) {
          listItems = JSON.parse(localStorage.getItem("Cart"));
          addHTMLToCart();
        }
      });
  };

  getData();

  calculateTotal();

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addItemToCart);
  });

  const cartItems = document.querySelector(".cart .items-lis");
  cartItems.addEventListener("click", (event) => {
    if (event.target.classList.contains("sup")) {
      updateQuantity(event.target, -1);
    } else if (event.target.classList.contains("plus")) {
      updateQuantity(event.target, 1);
    }
  });
});

function calculateTotal() {
  const items = document.querySelectorAll(".cart .items-lis .item");
  let total = 0;

  items.forEach((item) => {
    const priceElement = item.querySelector(".price");
    const quantityElement = item.querySelector(".quint");
    const price = parseFloat(priceElement.textContent);
    const quantity = parseInt(quantityElement.textContent, 10);
    total += price * quantity;
  });

  document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
}

function addItemToCart(event) {
  const itemElement = event.target.closest(".item");
  const itemName = itemElement.querySelector(".name").textContent;
  const itemPrice = itemElement.querySelector(".price").textContent;

  const cartItems = document.querySelector(".cart .items-lis");
  const cartItem = document.createElement("div");
  cartItem.classList.add("item");
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

function updateQuantity(button, change) {
  const quantityElement = button.parentElement.querySelector(".quint");
  let quantity = parseInt(quantityElement.textContent, 10);
  quantity = Math.max(0, quantity + change);
  quantityElement.textContent = quantity;

  calculateTotal();
}
