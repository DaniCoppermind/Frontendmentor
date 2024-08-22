const $ = (el) => document.querySelector(el)
const $$ = (el) => document.querySelectorAll(el)
const data = '../assets/data.json'

const cartContainer = $('section')
const productContainer = $('.cart-items-product')
const cartSummary = $('#cart-summary .cart-items-list')
const confirmButton = $('#confirm-button')

let cart = []

fetch(data)
  .then((response) => response.json())
  .then((data) => {
    renderProducts(data)
  })
  .catch((err) => {
    console.error('Error fetching data:', err)
  })

function renderProducts(data) {
  productContainer.innerHTML = data
    .map(
      (product) => `
    <li class="cart-item">
      <img src="${product.image.desktop}" alt="${
        product.name
      }" class="cart-item-image">  
      <div class="cart-item-button"> 
        <div class="add-to-cart-btn">
          <img src="assets/images/icon-add-to-cart.svg"/> Add to Cart
        </div>
      </div>
      <div class="cart-item-details">
        <span>${product.category}</span>
        <h2>${product.name}</h2>
        <p class="cart-item-price">$${product.price.toFixed(2)}</p>
      </div>
    </li>
  `
    )
    .join('')
}

function addToCart(name, price) {
  const existingProduct = cart.find((item) => item.name === name)
  if (existingProduct) {
    existingProduct.quantity++
    existingProduct.total = (
      existingProduct.quantity * existingProduct.price
    ).toFixed(2)
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      total: price.toFixed(2),
    })
  }
  renderCartItems()
}

function renderCartItems() {
  cartSummary.innerHTML = ''
  cart.forEach((item) => {
    const carItem = document.createElement('article')
    carItem.classList.add('cart-item-add')
    carItem.innerHTML = `
    <div class="item-details">
      <p class="item-title">${item.name}</p>
      <p class="cart-item-cost">
        <span class="item-quantity">${item.quantity}x</span>
        <span class="item-price">@ $${item.price.toFixed(2)}</span>
        <span class="item-total">$${item.total}</span>
      </p>
    </div>
    <button class="remove-item">
      <img src="assets/images/icon-remove-item.svg" />
    </button>
    `
    cartSummary.appendChild(carItem)
  })
  updateCartSummary()
}

function changeInterfaceButton(button, name) {
  button.innerHTML = ''
  const product = cart.find((item) => item.name === name)
  if (product) {
    button.innerHTML = `
      <button class="decrement-quantity">
        <img src="assets/images/icon-decrement-quantity.svg" />
      </button>
      <span class="quantity-display">${product.quantity}</span>
      <button class="increment-quantity">
        <img src="assets/images/icon-increment-quantity.svg" />
      </button>
    `
    button.classList.add('management-button')

    const decrementButton = button.querySelector('.decrement-quantity')
    decrementButton.addEventListener('click', () => {
      product.quantity--
      changeInterfaceButton(button, name)
      renderCartItems()
      if (product.quantity == 0) {
        removeFromCart(name)
        button.innerHTML = `
        <div class="add-to-cart-btn">
          <img src="assets/images/icon-add-to-cart.svg"/> Add to Cart
        </div>        
        `
        button.classList.remove('management-button')
      }
    })
  }
}

const updateCartSummary = () => {
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cart
    .reduce((acc, item) => acc + parseFloat(item.price * item.quantity), 0)
    .toFixed(2)

  document.querySelector('.cart-quantity').innerText = `(${cartQuantity})`
  document.querySelector('#total-price').innerText = `$${totalPrice}`
}

const removeFromCart = (name) => {
  cart = cart.filter((item) => item.name !== name)
  renderCartItems()
}

productContainer.addEventListener('click', (event) => {
  const clickedButton = event.target.closest('.add-to-cart-btn')
  if (clickedButton) {
    const productElement = event.target.closest('.cart-item')
    const productName = productElement.querySelector('h2').innerText
    const productPrice = parseFloat(
      productElement
        .querySelector('.cart-item-price')
        .innerText.replace('$', '')
    )

    addToCart(productName, productPrice)
    changeInterfaceButton(clickedButton, productName)
  }
})

cartSummary.addEventListener('click', (event) => {
  if (event.target.closest('.remove-item')) {
    const cartItemElement = event.target.closest('.cart-item-add')
    const itemName = cartItemElement.querySelector('.item-title').innerText

    removeFromCart(itemName)
  }
})

confirmButton.addEventListener('click', () => {
  const modal = $('#modal')


  modal.style.display = 'block'
})