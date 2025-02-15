const icon = document.querySelector("i.icon");
const cart = document.querySelector(".cart");
const close = document.querySelector(".btn.close");

icon.addEventListener("click", () => {
  cart.classList.toggle("active");
});
close.addEventListener("click", () => {
  cart.classList.toggle("active");
});

async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw console.error(`Response status: ${response.status}`);
    }
    const date = await parent(response.json());
    return date;
  } catch {
    console.error(`Response status: ${response.status}`);
  }
}

console.log(getData("../products.json"));
