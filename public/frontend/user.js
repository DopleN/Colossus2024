import AppManager from './main.js';
import ShoppingCart from './cart.js';

class AccountManager {

  loginDialog;
  signupDialog;
  loginDialogInstance;
  signupDialogInstance;

  toggleLoginBtn;
  toggleSignupBtn;

  loginFormElement;
  signupFormElement;

  constructor() {
    this.loginDialog = document.querySelector('#loginDialog');
    this.signupDialog = document.querySelector('#signupDialog');
    if (!this.loginDialog || !this.signupDialog) return;

    this.loginFormElement = this.loginDialog.querySelector('form');
    this.signupFormElement = this.signupDialog.querySelector('form');

    this.loginDialogInstance = new bootstrap.Modal(this.loginDialog, {
      keyboard: false
    });

    this.signupDialogInstance = new bootstrap.Modal(this.signupDialog, {
      keyboard: false
    });

    this.toggleLoginBtn = document.querySelector('#toggle-login');
    this.toggleSignupBtn = document.querySelector('#toggle-signup');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.toggleSignupBtn.addEventListener('click', this.toggleDialogs.bind(this));
    this.toggleLoginBtn.addEventListener('click', this.toggleDialogs.bind(this));

    this.loginFormElement.addEventListener('submit', this.processLogin.bind(this));
    this.signupFormElement.addEventListener('submit', this.processSignup.bind(this));
  }

  async processLogin(e) {
    e.preventDefault();
    if (!this.loginFormElement.checkValidity()) return;

    const formData = new FormData(this.loginFormElement);
    const formValues = Object.fromEntries(formData.entries());

    await this.authenticateUser(formValues);
  }

  async authenticateUser(formValues) {
    const loginButton = this.loginFormElement.querySelector('button');
    try {
      AppManager.displaySpinner(loginButton, true);
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      AppManager.displaySpinner(loginButton, false);

      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success';
      successMessage.innerHTML = 'Login successful!<br>Redirecting to your profile...';
      this.loginFormElement.prepend(successMessage);

      setTimeout(() => window.location.href = '/profile', 1000);

    } catch (error) {
      AppManager.displaySpinner(loginButton, false);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'alert alert-danger';
      errorMessage.textContent = error.message;
      this.loginFormElement.prepend(errorMessage);
      setTimeout(() => errorMessage.remove(), 2000);
    }
  }

  async processSignup(e) {
    e.preventDefault();
    if (!this.signupFormElement.checkValidity()) return;

    const formData = new FormData(this.signupFormElement);
    const formValues = Object.fromEntries(formData.entries());

    await this.createUser(formValues);
  }

  async createUser(formValues) {
    const signupButton = this.signupFormElement.querySelector('button');

    try {
      AppManager.displaySpinner(signupButton, true);
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      AppManager.displaySpinner(signupButton, false);

      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success';
      successMessage.innerHTML = 'Registration successful!<br>Redirecting to your profile...';
      this.signupFormElement.prepend(successMessage);

      setTimeout(() => {
        successMessage.remove();
        window.location.href = '/profile';
      }, 1000);

    } catch (error) {
      AppManager.displaySpinner(signupButton, false);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'alert alert-danger';
      errorMessage.innerHTML = `${error.message}<br>Please use a different email.`;
      this.signupFormElement.prepend(errorMessage);
      setTimeout(() => errorMessage.remove(), 2000);
    }
  }

  toggleDialogs(e) {
    const targetModal = e.target.getAttribute('data-modal-name');
    this.closeDialogs();
    if (targetModal === 'login') {
      setTimeout(() => this.loginDialogInstance.show(), 200);
    } else {
      setTimeout(() => this.signupDialogInstance.show(), 200);
    }
  }

  closeDialogs() {
    this.loginDialogInstance.hide();
    this.signupDialogInstance.hide();
  }
}

export default AccountManager;
