const icon = document.querySelector("i.icon");
const cart = document.querySelector(".cart");
const close = document.querySelector(".btn.close");

icon.addEventListener("click", () => {
  cart.classList.toggle("active");
});
close.addEventListener("click", () => {
  cart.classList.toggle("active");
});
