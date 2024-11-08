import Main from '../main.js';
import Header from '../header.js';

class Privacy {
  constructor() {
    this.renderPrivacyPolicy();
  }

  renderPrivacyPolicy() {
    const content = `
      <h1>Privacy Policy</h1>
      <p>Your privacy is important to us. This policy explains how we handle your personal information...</p>
      <!-- Add more detailed content here -->
    `;

    const privacyContainer = document.createElement('div');
    privacyContainer.innerHTML = content;
    document.body.appendChild(privacyContainer);
  }
}

Main.initComponents([Header, Privacy]);

Main.hidePreLoader();
