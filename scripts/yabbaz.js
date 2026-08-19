import {products} from '../data/products.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts (list) {
  let productsHTML = ``;

  if (list.length === 0) {
    productsHTML = `<li class="category-empty">Nothing in this category yet.</li>`;
  }

  list.forEach( (product) => {
    productsHTML += `
  <li class="product-card js-product-card">
    <div class="product-pic-container">
      <img class="product-pic" src="${product.image}">
    </div>
    <div class="product-name js-product-name">${product.name}</div>
    <div class="product-rating">
      <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
      <span class="product-rating-number">${product.rating.count}</span>
    </div>
    <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
    <select class="product-quantity-select js-product-quantity-select">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
    <button class="product-add-button js-product-add-button" data-product-id="${product.id}">Add to Cart</button>
  </li>`
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  document.querySelectorAll('.js-product-add-button')
    .forEach((button) => {
      button.addEventListener('click', addToCart)
    })
  ;
};

renderProducts(products);

document.querySelectorAll('.js-category-link')
  .forEach((link) => {
    link.addEventListener('click', filterProducts)
  })
;

function filterProducts (event) {
  const link = event.currentTarget;
  const category = link.dataset.category;

  document.querySelectorAll('.js-category-link')
    .forEach((other) => {
      other.classList.remove('category-link-active');
    });
  link.classList.add('category-link-active');

  if (category === 'all') {
    renderProducts(products);
  } else {
    renderProducts(products.filter((product) => product.category === category));
  };
};

function addToCart (event) {
  const button = event.currentTarget;
  const productCard = button.closest('.js-product-card')
  const quantitySelect = productCard.querySelector('.js-product-quantity-select');
  const buttonProductId = button.dataset.productId;

  let matchingItem = cart.find((item) => buttonProductId === item.productId);

  if (matchingItem) {
    matchingItem.quantity += Number(quantitySelect.value);
  } else {
    cart.push({
    productId: buttonProductId,
    quantity: Number(quantitySelect.value),
    // bez tego koszyk pokazuje date dostawy w naglowku, ale zadnej
    // kropki wybranej - getDeliveryOption cofa sie do pierwszej opcji,
    // a radio porownuje surowe pole
    deliveryOptionId: '1'
    });
  };

  button.classList.add('is-added');
  setTimeout(() => {button.classList.remove('is-added');}, 2000);

  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.js-cart-counter')
    .innerHTML = cartQuantity;

  localStorage.setItem('cart', JSON.stringify(cart));
};

let cartQuantity = 0;

cart.forEach((item) => {
  cartQuantity += item.quantity;
});
document.querySelector('.js-cart-counter')
  .innerHTML = cartQuantity
;
