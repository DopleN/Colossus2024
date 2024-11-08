import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';
import FormValidator from '../formValidator.js';

class Register {
    registerFormContainer;
    registerForm;

    constructor() {
        this.registerFormContainer = document.querySelector('.register-form');
        this.registerForm = this.registerFormContainer.querySelector('form');

        this.initRegisterEventListeners();
        this.initPasswordVisibilityToggle();
    }

    initRegisterEventListeners() {
        this.registerForm.addEventListener('submit', this.handleRegisterFormSubmit.bind(this));
    }

    initPasswordVisibilityToggle() {
        const passwordFields = this.registerForm.querySelectorAll('input[type="password"]');
        const toggleButtons = this.registerForm.querySelectorAll('.toggle-password');

        toggleButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const inputField = passwordFields[index];
                const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
                inputField.setAttribute('type', type);
                button.textContent = type === 'password' ? 'Show' : 'Hide';
            });
        });
    }

    async handleRegisterFormSubmit(e) {
        e.preventDefault();
        if (!this.registerForm.checkValidity()) return;

        const formData = new FormData(this.registerForm);
        const form = Object.fromEntries(formData.entries());

        await this.registerUser(form);
    }

    async registerUser(form) {
        const registerBtn = this.registerForm.querySelector('button');

        try {
            Main.renderSpinner(registerBtn, true);
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            Main.renderSpinner(registerBtn, false);

            // Success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.innerHTML = 'Registration successful! Redirecting to your profile...';
            this.registerForm.prepend(successMessage);
            setTimeout(() => {
                successMessage.remove();
                window.location.href = '/profile';
            }, 1000);

        } catch (error) {
            Main.renderSpinner(registerBtn, false);

            // Error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.innerHTML = `${error.message}<br>Please choose a different email.`;
            this.registerForm.prepend(errorMessage);
            setTimeout(() => errorMessage.remove(), 2000);
        }
    }
}

Main.initComponents([Header, Register, FormValidator]);
Main.hidePreLoader();
