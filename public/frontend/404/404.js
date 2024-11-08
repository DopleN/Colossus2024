import Main from '../main.js';
import Header from '../header.js';

class PageNotFound {
  constructor() {
    this.render();
  }

  render() {
    const content = document.querySelector('.content');
    
    // Clear existing content
    content.innerHTML = '';

    // Create and append the 404 message
    const message = document.createElement('div');
    message.classList.add('page-not-found', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center');
    message.innerHTML = `
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/" class="btn btn-primary">Go to Home</a>
    `;
    
    content.appendChild(message);
  }
}

// Initialize components
Main.initComponents([Header, PageNotFound]);

Main.hidePreLoader();
