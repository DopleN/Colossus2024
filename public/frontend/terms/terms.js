import Main from '../main.js';
import Header from '../header.js';

class Terms {
  constructor() {
    this.render();
  }

  render() {
    const content = document.querySelector('.content');

    // Clear existing content
    content.innerHTML = '';

    // Create and append the terms content
    const termsContent = document.createElement('div');
    termsContent.classList.add('terms', 'p-4');
    termsContent.innerHTML = `
      <h1>Terms and Conditions</h1>
      <p>Welcome to our website! These terms and conditions outline the rules and regulations for the use of our website.</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing this website, you accept these terms and conditions in full. Do not continue to use this website if you do not accept all of the terms and conditions stated on this page.</p>

      <h2>2. Modifications</h2>
      <p>We reserve the right to modify these terms at any time, and your continued use of the site will signify your acceptance of any adjusted terms.</p>

      <h2>3. Limitation of Liability</h2>
      <p>In no event shall we be liable for any direct, indirect, incidental, special, consequential or punitive damages arising from your use of this site.</p>
      
      <h2>4. Governing Law</h2>
      <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction.</p>

      <a href="/" class="btn btn-primary mt-3">Go to Home</a>
    `;
    
    content.appendChild(termsContent);
  }
}

// Initialize components
Main.initComponents([Header, Terms]);

Main.hidePreLoader();
