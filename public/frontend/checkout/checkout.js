import App from '../app.js';
import ProductView from '../productView.js';
import Navbar from '../navbar.js';
import ShoppingCart from '../shoppingCart.js';
import Validator from '../formValidator.js';

class Checkout {

  constructor() {
    this.cartItems = ShoppingCart.getCart();
    this.cartContainer = document.querySelector('#checkout-cart-container');
    this.form = document.querySelector('#checkoutForm');
    this.fieldsContainer = document.querySelector('#checkout-fields-container');

    this.loadCountries();
    this.renderCart();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.cartContainer.addEventListener('click', this.handleCartClick.bind(this));
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    this.setupCreditCardFields();
  }

  async loadCountries() {
    const countrySelect = this.form.querySelector('#country');

    try {
      const response = await fetch('https://restcountries.com/v3.1/region/america');
      const countries = await response.json();

      countrySelect.innerHTML = '<option value="">Choose...</option>';

      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name.common;
        option.textContent = country.name.common;

        if (country.name.common === 'United States') {
          option.selected = true;
        }

        countrySelect.appendChild(option);
      });

    } catch (error) {
      console.error('Error loading countries:', error);
    }
  }

  handleCartClick(e) {
    if (e.target.closest('.btn-checkout-delete-cart-item')) {
      this.removeCartItem(e);
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    if (!this.form.checkValidity()) return;

    if (this.cartItems.length === 0) {
      App.renderMessage(this.fieldsContainer, true, "You can't checkout because your cart is empty.", 'beforeend');
      setTimeout(() => App.renderMessage(this.fieldsContainer, false), 1500);
      return;
    }

    const formData = new FormData(this.form);
    const orderData = Object.fromEntries(formData.entries());

    this.cartItems = ShoppingCart.getCart();
    orderData.cart = this.cartItems;
    orderData.total = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    await this.placeOrder(orderData);
  }

  async placeOrder(order) {
    try {
      App.renderSpinner(this.fieldsContainer.querySelector('button[type="submit"]'), true);
      const response = await fetch(`/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error('Failed to submit order');
      await response.json();
      App.renderSpinner(this.fieldsContainer.querySelector('button[type="submit"]'), false);

      this.cartItems = [];
      ShoppingCart.updateCart(this.cartItems);

      window.location.href = '/thankyou';

    } catch (error) {
      App.renderSpinner(this.fieldsContainer.querySelector('button[type="submit"]'), false);
      console.error(error);
    }
  }

  removeCartItem(e) {
    const row = e.target.closest('tr');
    const productId = row.getAttribute('data-product-id');
    const size = row.getAttribute('data-product-size');

    this.cartItems = ShoppingCart.getCart();
    const updatedCart = this.cartItems.filter(item => !(item._id === productId && item.size === size));

    ShoppingCart.updateCart(updatedCart);
    this.renderCart();
  }

  renderCart() {
    const tableBody = this.cartContainer.querySelector('tbody');
    tableBody.innerHTML = '';

    this.cartItems = ShoppingCart.getCart();
    this.cartContainer.querySelector('.badge').innerText = this.cartItems.length;

    if (this.cartItems.length === 0) {
      tableBody.parentElement.insertAdjacentHTML('beforebegin', `<p class="lean">Your cart is empty..</p>`);
      this.cartContainer.querySelector('.cart-total').innerText = `$0.00`;
      return;
    }

    let total = 0;
    this.cartItems.forEach(item => {
      tableBody.insertAdjacentHTML('beforeend', `
        <tr data-product-id="${item._id}" data-product-quantity="${item.quantity}" data-product-size="${item.size}">
          <td><img src="${item.img}" class="img-fluid" alt="${item.title}" style="width: 50px; height: auto;"></td>
          <td style="font-size:0.85rem;">${item.title}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
          <td>${item.size}</td>
          <td><button type="button" class="btn btn-outline-danger btn-sm btn-checkout-delete-cart-item">&times;</button></td>
        </tr>`);

      total += item.price * item.quantity;
    });

    const formattedTotal = total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    this.cartContainer.parentElement.querySelector('.cart-total').innerText = formattedTotal;
  }

  setupCreditCardFields() {
    document.getElementById('cc-number').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    });

    document.getElementById('cc-cvv').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
  }
}

App.initComponents([Navbar, ProductView, Validator, Checkout]);
App.hidePreLoader();
