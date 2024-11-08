import Main from '../main.js';
import Header from '../header.js';
import Cart from '../cart.js';

class Product {
  constructor() {
    this.form = document.querySelector('.add-to-cart-form');
    this.addToCartBtn = this.form.querySelector('.add-to-cart-btn');
    this.checkoutBtn = document.querySelector('.checkout-btn');
    this.redirectToCheckout = false;

    this.initProductEventListeners();
  }

  initProductEventListeners() {
    this.form.addEventListener('submit', this.handleProductFormSubmit.bind(this));
    this.checkoutBtn.addEventListener('click', this.handleCheckoutClick.bind(this));
  }

  handleCheckoutClick(e) {
    e.preventDefault();
    this.redirectToCheckout = true;
    this.form.requestSubmit();
  }

  handleProductFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const productId = form.dataset.productId; // Use dataset for cleaner code
    const title = form.closest('.modal-body').parentElement.querySelector('.product-title').innerText;
    const priceText = form.closest('.modal-body').parentElement.querySelector('.product-price').innerText;
    const price = parseFloat(priceText.replace(/[^0-9.-]+/g, "")); // Handle price parsing
    const img = form.closest('.modal-body').parentElement.parentElement.querySelector('img').src;
    const size = form.querySelector('#size-option').value;
    const quantity = parseInt(form.querySelector('#quantity-option').value, 10);

    // Simple validation
    if (!size || quantity <= 0 || isNaN(quantity)) {
      Main.renderMessage(this.form, false, 'Please select a valid size and quantity.', 'beforeend');
      return;
    }

    const product = {
      _id: productId,
      title,
      img,
      size,
      quantity,
      price,
    };

    Cart.addToCart(product);

    if (this.redirectToCheckout) {
      this.redirectToCheckout = false;
      window.location.href = '/checkout';
      return;
    }

    Main.renderMessage(this.form, true, 'Product was added to your cart!', 'beforeend');
    setTimeout(() => {
      Main.renderMessage(this.form, false);
    }, 1500);
  }
}

Main.initComponents([Header, Product]);
Main.hidePreLoader();
