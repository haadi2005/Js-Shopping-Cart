const item_container = document.querySelector(".itemsList");
const cart_container = document.querySelector(".cart-items");
const cart_text = document.querySelector(".align");
const cart_total = document.querySelector(".total-price");

const items = [
  { id: 1, name: "Jordan Retro 3 OG", price: 200, img: "./Imgs/1.png", qty: 1 },
  {
    id: 2,
    name: "Jordan AJ 4 Retro OG",
    price: 160,
    img: "./Imgs/2.png",
    qty: 1,
  },
  {
    id: 3,
    name: "Jordan Spizike Low",
    price: 180,
    img: "./Imgs/3.png",
    qty: 1,
  },
  {
    id: 4,
    name: "Jordan Spizike Low",
    price: 165,
    img: "./Imgs/4.png",
    qty: 1,
  },
  { id: 5, name: "Jordan AJ 1 Low SE", price: 79, img: "./Imgs/5.png", qty: 1 },
  { id: 6, name: "Jordan MVP", price: 119, img: "./Imgs/6.png", qty: 1 },
];

let totalAmount = 0;
let cart = [];
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
  totalPrice();
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
          <p class="title">${item.name}</p>
          <p class="title">$${item.price}</p>
          <span class="qty">
            <button class="qtyMinusBtn" data-cartitemid="${item.id}">-</button>
            <p class="qty-num">${item.qty}</p>
            <button class="qtyAddBtn" data-cartitemid="${item.id}">+</button>
          </span>
          <button class="deleteBtn"><img data-delitem="${item.id}" class="delIcon"
          src="./Imgs/delete.svg" alt="Del"></button>
        </div>
      </div>`;
    })
    .join("");

  cart_container.innerHTML = html;
}

function totalPrice() {
  //reset
  totalAmount = 0;

  // loop over cart and keep adding each one price(from obj) to totalAmount
  for (let i = 0; i < cart.length; i++) {
    const obj = cart[i];
    totalAmount = totalAmount + obj.price;
  }

  cart_total.innerHTML = "$" + totalAmount;
}

item_container.addEventListener("click", (e) => {
  // Ignores clicks that are not on "Add to cart" btn
  // stops event bubbling
  if (!e.target.classList.contains("card-btn")) return;
  // targets the data-id from (items) html
  const data_id = e.target.dataset.id;

  addItem(data_id);
  renderUi();
  totalPrice();
  saveItems();
});

cart_container.addEventListener("click", (e) => {
  // targets the data-cartitemid from (cart items) html
  const cartItemId = e.target.dataset.cartitemid;

  // ADD (+) QUANTITY LOGIC
  if (e.target.classList.contains("qtyAddBtn")) {
    // .find() searches the cart array for the item whose id matches the data-cartItemId from the clicked button. This lets us identify which cart item to update when the + or - button is pressed.
    const foundCartItem = cart.find((cartItem) => {
      return cartItem.id === parseInt(cartItemId);
    });
    // if foundCartItem has obj(item) increment++ the qty of item(obj)
    if (foundCartItem) foundCartItem.qty++;
  }

  // MINUS (-) QUANTITY LOGIC
  if (e.target.classList.contains("qtyMinusBtn")) {
    const foundCartItem = cart.find((cartItem) => {
      return cartItem.id === parseInt(cartItemId);
    });
    // if if foundCartItem has obj(item) & its greater then 1 then decrement-- qty of item(obj)
    if (foundCartItem && foundCartItem.qty > 1) foundCartItem.qty--;
  }

  // DELETE CART ITEM LOGIC
  // Targets the data-delitem from (cart item) html
  const deleteitem = e.target.dataset.delitem;

  if (e.target.classList.contains("delIcon")) {
    // Remove item with matching ID by keeping all others and not matched one
    let foundCartItem = cart.filter((cartItem) => {
      return cartItem.id !== parseInt(deleteitem);
    });
    // Update cart with filtered result (excluding the deleted item)
    cart = foundCartItem;
    totalPrice(); // Recalculate totalPrice
  }

  renderUi();
  saveItems();
});

// CLEAR CART LOGIC
cart_text.addEventListener("click", (e) => {
  if (!e.target.classList.contains("clearCart")) return;
  cart.length = 0; //empty cart arr
  cart_container.innerHTML = ""; // clear cart ui
  localStorage.removeItem("cart"); // clear cart local storage
  cart_total.innerHTML = "$" + 0; // clear total price
});
