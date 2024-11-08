import Main from '../main.js';
import Header from '../header.js';

class ThankYou {
  constructor() {
    this.render();
  }

  render() {
    const content = document.querySelector('.content');
    
    // Clear existing content
    content.innerHTML = '';

    // Create and append the thank-you message
    const message = document.createElement('div');
    message.classList.add('thank-you', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center');
    message.innerHTML = `
      <h1>Thank You!</h1>
      <h2>Your order has been placed successfully.</h2>
      <p>We appreciate your business and hope to see you again soon!</p>
      <a href="/" class="btn btn-primary">Go to Home</a>
    `;
    
    content.appendChild(message);
  }
}

// Initialize components
Main.initComponents([Header, ThankYou]);

Main.hidePreLoader();
