import Main from '../../main.js';
import Header from '../../header.js';

class Orders {
  constructor() {
    this.ordersContainer = document.querySelector('#orders-container');
    this.loadOrders();
  }

  async loadOrders() {
    try {
      Main.renderSpinner(this.ordersContainer, true); // Show loading spinner
      const response = await fetch('/api/orders'); // Adjust the API endpoint as needed

      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }

      const orders = await response.json();
      this.renderOrders(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Main.renderMessage(this.ordersContainer, true, error.message, 'beforeend');
    } finally {
      Main.renderSpinner(this.ordersContainer, false); // Hide loading spinner
    }
  }

  renderOrders(orders) {
    if (orders.length === 0) {
      this.ordersContainer.innerHTML = '<p>No orders found.</p>';
      return;
    }

    const ordersList = orders.map(order => `
      <div class="order-card">
        <h4>Order #${order.id}</h4>
        <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
        <p>Total: ${order.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
        <button class="btn btn-info" data-order-id="${order.id}">View Details</button>
      </div>
    `).join('');

    this.ordersContainer.innerHTML = ordersList;

    this.addOrderDetailListeners();
  }

  addOrderDetailListeners() {
    const detailButtons = this.ordersContainer.querySelectorAll('.btn-info');
    detailButtons.forEach(button => {
      button.addEventListener('click', () => {
        const orderId = button.getAttribute('data-order-id');
        this.showOrderDetails(orderId);
      });
    });
  }

  async showOrderDetails(orderId) {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details.');
      }

      const orderDetails = await response.json();
      // Here you could create a modal or a new section to display order details
      console.log(orderDetails);
      // Implement display logic for order details...

    } catch (error) {
      console.error('Error loading order details:', error);
      Main.renderMessage(this.ordersContainer, true, error.message, 'beforeend');
    }
  }
}

Main.initComponents([Header, Orders]);
Main.hidePreLoader();
