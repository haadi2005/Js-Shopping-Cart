const item_container = document.querySelector(".itemsList");
const cart_container = document.querySelector(".cart-items");

const items = [
  { id: 1, name: "Jordan Retro 3 OG", price: 200, img: "./Imgs/1.png" },
  { id: 2, name: "Jordan AJ 4 Retro OG", price: 160, img: "./Imgs/2.png" },
  { id: 3, name: "Jordan Spizike Low", price: 180, img: "./Imgs/3.png" },
  { id: 4, name: "Jordan Spizike Low", price: 165, img: "./Imgs/4.png" },
  { id: 5, name: "Jordan AJ 1 Low SE", price: 79, img: "./Imgs/5.png" },
  { id: 6, name: "Jordan MVP", price: 119, img: "./Imgs/6.png" },
];

const cart = [];
loadItems();

function loadItems() {
  // Get the key(and its value aka cart) from the local storage
  const savedCart = localStorage.getItem("cart");

  // if cart is null, undefined, empty return nothing
  if (!savedCart) return;
  // Converts the json format cart to js obj again
  const pushedCart = JSON.parse(savedCart);
  // here we are pushing the freshly parsed obj into the cart array, but the freshly parsed obj is wraped in array if we push it directly it wil be nested inside the cart, like "cart = [ [{item1},{item2}] ]", we dont want that, by using ... spread operator it picks it obj from the parsed obj array and put it in cart.
  // cart = [ {item1} ] no nested arrays
  cart.push(...pushedCart);
  renderUi();
}

function saveItems() {
  // Converting the cart into Json format
  const savedCart = JSON.stringify(cart);
  // Set "cart" as key and Json format cart as value in localStorage
  localStorage.setItem("cart", savedCart);
}

function addItem(data_id) {
  // Using .find() to find the id(from obj) what matches the id in html(data-id), parseInt() converts the string to number (data-id="1" to 1)
  const matchedItem = items.find((item) => item.id === parseInt(data_id));

  // this "if statement" make sure there are no duplicates items in cart by using .find() to loop over all objs in cart array and check if single obj id is equal to the data_id
  if (cart.find((cartItem) => cartItem.id === parseInt(data_id))) {
    //return nothing and exits function
    return;
  } else {
    //the matched item (obj in items array) get pushed to cart array
    cart.push(matchedItem);
  }
}

function renderUi() {
  // Applied 2 methods on items array "items.map().join()" , so in .map we went through all objects in the items array and filtered .name .price and .img from those objects above, so it returns the .name .price .img in the innerhtml(with place holders), so we converted objs in html.
  // now we have html but in arrays, so we use .join to convert it in to string
  const html = cart
    .map((item) => {
      return `<div class="item-cart">
    <img class="item-img-cart" src="${item.img}" />
    <div class="data-cart">
    <p>${item.name}</p>
    <p>$${item.price}</p>
    <span class="qty">
    <button class="qty-btn">-</button>
    <p class="qty-num">1</p>
    <button class="qty-btn">+</button>
    </span>
    </div>
    </div>`;
    })
    .join("");

  cart_container.innerHTML = html;
}

item_container.addEventListener("click", (e) => {
  // Ignores clicks that are not on "Add to cart" btn
  // stops event bubbling
  if (!e.target.classList.contains("card-btn")) return;

  let data_id = e.target.dataset.id;
  addItem(data_id);
  renderUi();
  saveItems();
});
