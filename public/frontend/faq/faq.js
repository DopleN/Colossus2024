import Main from '../main.js';
import Header from '../header.js';

class Faq {
  constructor() {
    this.faqContainer = document.querySelector('#faq-container'); // Assuming you have a container in your HTML
    this.loadFAQs();
  }

  async loadFAQs() {
    try {
      const response = await fetch('/api/faqs'); // Replace with your actual API endpoint
      const faqs = await response.json();

      this.renderFAQs(faqs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  }

  renderFAQs(faqs) {
    const html = faqs.map(faq => `
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${faq.id}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${faq.id}" aria-expanded="true" aria-controls="collapse-${faq.id}">
            ${faq.question}
          </button>
        </h2>
        <div id="collapse-${faq.id}" class="accordion-collapse collapse" aria-labelledby="heading-${faq.id}" data-bs-parent="#faq-container">
          <div class="accordion-body">
            ${faq.answer}
          </div>
        </div>
      </div>
    `).join('');

    this.faqContainer.innerHTML = html;
  }
}

Main.initComponents([Header, Faq]);
Main.hidePreLoader();
