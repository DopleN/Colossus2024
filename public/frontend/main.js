class AppManager {
  
  headerElement;
  loadingSpinner;
  isSpinnerVisible = false;
  notification;
  isNotificationVisible = false;

  static displaySpinner(targetElement, show = true) {
    if (this.isSpinnerVisible && show) return;

    if (!show) {
      targetElement.classList.remove('hidden');
      if (this.loadingSpinner) this.loadingSpinner.remove();
      this.isSpinnerVisible = false;
      return;
    }

    targetElement.classList.add('hidden');

    this.loadingSpinner = document.createElement('div');
    this.loadingSpinner.classList.add('spinner', 'd-flex', 'justify-content-center', 'my-2');
    this.loadingSpinner.innerHTML = `<div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
         </div>`;
    targetElement.insertAdjacentElement('beforebegin', this.loadingSpinner);

    this.isSpinnerVisible = true;
  }

  static displayNotification(targetElement, show = true, text = '', position = '') {
    if (this.isNotificationVisible && show) return;

    if (!show) {
      if (this.notification) this.notification.remove();
      this.isNotificationVisible = false;
      return;
    }

    this.notification = document.createElement('div');
    this.notification.classList.add('notification', 'd-flex', 'justify-content-center', 'my-2');
    this.notification.innerHTML = `<span class="message-text">${text}</span>`;
    targetElement.insertAdjacentElement(position, this.notification);

    this.isNotificationVisible = true;
  }

  static hideLoadingIndicator() {
    window.addEventListener('load', () => {
      const loader = document.getElementById('loader');
      if (loader) loader.style.display = 'none';
    });
  }

  static initializeComponents(componentClasses) {
    document.addEventListener('DOMContentLoaded', async () => {
      const header = document.querySelector('header');
      if (header) {
        const height = header.offsetHeight;
        const contentArea = document.querySelector('.content');
        if (contentArea && contentArea.children[1]) {
          contentArea.children[1].style.marginTop = `${height}px`;
        }
      }

      for (const Component of componentClasses) {
        await new Component();
      }
    });
  }
}

export default AppManager;
