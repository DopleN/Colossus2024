import Main from '../main.js';
import Header from '../header.js';

class Shipping {
  constructor() {
    this.render();
  }

  render() {
    const content = document.querySelector('.content');

    // Clear existing content
    content.innerHTML = '';

    // Create and append the shipping information
    const shippingContent = document.createElement('div');
    shippingContent.classList.add('shipping', 'p-4');
    shippingContent.innerHTML = `
      <h1>Shipping Information</h1>
      <p>We aim to deliver your order as quickly as possible. Below are our shipping policies:</p>

      <h2>1. Shipping Methods</h2>
      <p>We offer several shipping options, including standard and expedited shipping. Choose the method that suits you best during checkout.</p>

      <h2>2. Shipping Costs</h2>
      <p>Shipping costs are calculated based on your location and the selected shipping method. You'll see the total shipping cost during the checkout process.</p>

      <h2>3. Delivery Time</h2>
      <p>Delivery times vary based on your location and the shipping method chosen. Standard shipping typically takes 5-7 business days, while expedited shipping can take 2-3 business days.</p>

      <h2>4. Order Tracking</h2>
      <p>Once your order has shipped, you will receive an email with tracking information so you can monitor your shipment's progress.</p>

      <h2>5. International Shipping</h2>
      <p>We do offer international shipping, but delivery times and costs may vary. Additional customs fees may apply depending on the destination country.</p>

      <a href="/" class="btn btn-primary mt-3">Go to Home</a>
    `;
    
    content.appendChild(shippingContent);
  }
}

// Initialize components
Main.initComponents([Header, Shipping]);

Main.hidePreLoader();
