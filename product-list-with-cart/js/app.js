const $ = (el) => document.querySelector(el)
const $$ = (el) => document.querySelectorAll(el)
const data = '../assets/data.json'

const cartContainer = $('section')

fetch(data)
  .then((response) => response.json())
  .then((data) => {
    renderProducts(data)
  })
  .catch((err) => {
    console.error('Error fetching data:', err)
  })

const renderProducts = (data) => {
  const productCard = $('.cart-items-product')

  data.map((product) => {
    productCard.innerHTML += `
    <li class="cart-item">
      <img src="${product.image.desktop}" alt="${
      product.name
    }" class="cart-item-image">  
      <button>
        <img class="add-to-cart-btn" src="assets/images/icon-add-to-cart.svg"/> Add to Cart
      </button>
      <div class="cart-item-details">
        <span class="cart-item-category">${product.category}</span>
        <h2 class="cart-item-title">${product.name}</h2>
        <p class="cart-item-price">$${product.price.toFixed(2)}</p>
      </div>
    </li>
    `
  })
}
