import {deliveryOptions, getDeliveryOption} from '../data/deliveryOptions.js';
import {products} from '../data/products.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}

function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderPage();
  }
}

function removeItems(productId, quantityToRemove) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity -= quantityToRemove;
    
    if (matchingItem.quantity <= 0) {
      cart = cart.filter((item) => item.productId !== productId);
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  renderPage();
}

function deliveryOptionsHTML(checkoutItem, item) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === getDeliveryOption(item.deliveryOptionId).id;

    html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${checkoutItem.id}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${checkoutItem.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

function renderCartHTML() {
  let checkoutproductsHTML = ``;

  cart.forEach((item) => {
    let checkoutItem = products.find((product) => product.id === item.productId);

    if (!checkoutItem) return;

    const deliveryOptionId = item.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    checkoutproductsHTML += `
    <li class="product-card checkout-product-card js-product-card">
      <div class="delivery-date-text">Delivery date: ${dateString}</div>
      <div class="checkout-product-container">
        <div class="product-pic-container checkout-product-pic-container">
          <img class="product-pic" src="${checkoutItem.image}">
        </div>
        <div class="whole-product-info">
          <div class="checkout-product-info">
            <div class="product-name js-product-name">${checkoutItem.name}</div>
            <div class="product-rating">
              <img class="product-rating-stars" src="images/ratings/rating-${checkoutItem.rating.stars * 10}.png">
              <span class="product-rating-number">${checkoutItem.rating.count}</span>
            </div>    
            <select class="product-quantity-select js-product-quantity-select">
              <option value="-">-</option>
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
            <div class="button-quantity-container">
              <button class="product-remove-button checkout-product-remove-button js-product-remove-button" data-product-id="${item.productId}">Remove</button>
              <span class="checkout-item-quantity">QUANTITY: ${item.quantity}</span>
            </div>
          </div> 
          <div class="product-price checkout-product-price">$${(checkoutItem.priceCents / 100).toFixed(2)}</div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(checkoutItem, item)}
          </div>
        </div>
      </div>  
    </li>`;
  });

  document.querySelector('.js-checkout-cart').innerHTML = checkoutproductsHTML;

  document.querySelectorAll('.js-product-remove-button')
    .forEach((button) => {
      button.addEventListener('click', (event) => {
        const btn = event.currentTarget;
        const productCard = btn.closest('.js-product-card');
        const quantitySelect = productCard.querySelector('.js-product-quantity-select');
        const productId = btn.dataset.productId;
        
        let quantityToRemove = Number(quantitySelect.value);
        if (isNaN(quantityToRemove)) {
          quantityToRemove = 10000; 
        }

        removeItems(productId, quantityToRemove);
      });
    })
  ;

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const productId = element.dataset.productId;
        const deliveryOptionId = element.dataset.deliveryOptionId;
        
        updateDeliveryOption(productId, deliveryOptionId);
      });
    })
  ;
}

function renderCartCounter() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.js-cart-counter').innerHTML = cartQuantity;
}

function renderPage() {
  renderCartHTML();
  renderCartCounter();
}

renderPage();