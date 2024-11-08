class ShoppingCart {

  modalElement;
  cartButton;
  modalInstance;

  totalAmount = 0;
  items = [];

  constructor() {
    this.modalElement = document.querySelector('#cart-modal');
    this.cartButton = document.querySelector('#cart-btn');
    this.items = ShoppingCart.fetchCartItems();
    this.items.forEach(item => this.totalAmount += item.price);

    this.modalInstance = new bootstrap.Modal(this.modalElement, {
      keyboard: false
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.modalElement.addEventListener('click', this.handleModalClick.bind(this));
    this.cartButton.addEventListener('click', this.displayCart.bind(this));
  }

  handleModalClick(e) {
    if (e.target.closest('.btn-delete-cart-item')) {
      this.removeCartItem(e);
    }
  }

  static addItem(product) {
    const { _id, size, quantity } = product;

    const newItem = {
      _id,
      title: product.title,
      img: product.img,
      size,
      quantity,
      price: product.price
    };

    this.items = ShoppingCart.fetchCartItems();
    const existingIndex = this.items.findIndex(item => item._id === _id && item.size === size);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push(newItem);
    }

    ShoppingCart.saveCart(this.items);
    console.log('Cart updated:', this.items);
  }

  displayCart() {
    this.items = ShoppingCart.fetchCartItems();
    const tableBody = this.modalElement.querySelector('tbody');
    tableBody.innerHTML = '';

    if (this.items.length === 0) {
      this.modalElement.querySelector('.modal-footer > span').classList.remove('hidden');
      this.modalElement.querySelector('.modal-footer > span').innerText = 'Your cart is empty.';
      this.modalElement.querySelector('.cart-total').innerText = `$0.00`;
      return;
    }

    this.modalElement.querySelector('.modal-footer > span').classList.add('hidden');
    let total = 0;

    this.items.forEach(item => {
      tableBody.insertAdjacentHTML('beforeend', `
        <tr data-product-id="${item._id}" data-product-quantity="${item.quantity}" data-product-size="${item.size}">
          <td><img src="${item.img}" class="img-fluid" alt="${item.title}" style="width: 50px; height: auto;"></td>
          <td>${item.title}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
          <td>${item.size}</td>
          <td><button type="button" class="btn btn-outline-danger btn-sm btn-delete-cart-item">&times;</button></td>
        </tr>
      `);
      total += item.price * item.quantity;
    });

    const formattedTotal = total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    this.modalElement.querySelector('.cart-total').innerText = formattedTotal;
  }

  removeCartItem(e) {
    const row = e.target.closest('tr');
    const productId = row.getAttribute('data-product-id');
    const size = row.getAttribute('data-product-size');

    this.items = ShoppingCart.fetchCartItems();
    const updatedCart = this.items.filter(item => !(item._id === productId && item.size === size));

    ShoppingCart.saveCart(updatedCart);
    this.displayCart();

    this.modalElement.querySelector('.modal-footer > span').classList.remove('hidden');
    this.modalElement.querySelector('.modal-footer > span').innerText = 'Item removed';

    if (window.location.pathname === '/checkout') {
      return location.reload();
    }

    setTimeout(() => {
      this.modalInstance.hide();
    }, 1500);
  }

  static fetchCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

export default ShoppingCart;
