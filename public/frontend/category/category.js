import App from '../app.js';
import ProductView from '../productView.js';
import Navbar from '../navbar.js';

class ProductCategory {

  productContainer;
  filterButton;
  modalElement;
  modalInstance;
  applyButton;
  clearButton;

  selectedOptions = [];

  constructor() {
    this.filterButton = document.querySelector('#filter-btn');
    this.modalElement = document.querySelector('#filter-modal');
    this.modalInstance = new bootstrap.Modal(document.getElementById('filter-modal'), {
      keyboard: false
    });
    this.applyButton = document.querySelector('#apply-btn');
    this.clearButton = document.querySelector('#clear-btn');
    this.productContainer = document.querySelector('.product-list');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.filterButton.addEventListener('click', this.onFilterButtonClick.bind(this));
    this.applyButton.addEventListener('click', this.onApplyButtonClick.bind(this));
    this.clearButton.addEventListener('click', this.clearFilters.bind(this));
  }

  onFilterButtonClick(event) {
    // Logic for filter button click can be added here
  }

  async onApplyButtonClick(event) {
    this.modalInstance.hide();
    const selectedFilters = [...document.querySelectorAll('.filter:checked')];

    App.showSpinner(this.productContainer, true);
    const response = await fetch(`/api/categories/products/${this.modalElement.getAttribute('data-category-id')}`);
    if (!response.ok) throw new Error('Failed to load category products');
    const data = await response.json();

    const items = data.products;

    const maxPrice = parseInt(document.getElementById('priceRange').value);

    const brandFilters = new Set([...document.querySelectorAll('.filter-brand')]
      .filter(el => el.checked)
      .map(el => el.id));

    const genderFilters = new Set([...document.querySelectorAll('.filter-gender')]
      .filter(el => el.checked)
      .map(el => el.id));

    const sizeFilters = new Set([...document.querySelectorAll('.filter-size')]
      .filter(el => el.checked)
      .map(el => el.id));

    let filteredItems = items;
    if (brandFilters.size > 0) {
      filteredItems = items.filter(item => brandFilters.has(item.brand.name));
    }

    if (genderFilters.size > 0) {
      filteredItems = filteredItems.filter(item => genderFilters.has(item.gender));
    }

    if (sizeFilters.size > 0) {
      filteredItems = filteredItems.filter(item =>
        item.sizes.some(size => sizeFilters.has(Math.floor(parseFloat(size)).toString()))
      );
    }

    filteredItems = filteredItems.filter(item => item.price <= maxPrice);

    App.showSpinner(this.productContainer, false);
    if (filteredItems.length === 0) {
      this.clearFilters();
      App.displayMessage(this.productContainer, true, 'No products found..', 'beforebegin');

      setTimeout(() => 
        App.displayMessage(this.productContainer, false, 'No products found..', 'beforebegin'), 1500);

      this.modalInstance.hide();
      return;
    }

    if (selectedFilters.length === 0) {
      this.displayProducts(items);
      return;
    }

    this.displayProducts(filteredItems);
    App.showSpinner(this.productContainer, false);
  }

  displayProducts(products) {
    let outputHTML = '';
    products.forEach(item => {
      outputHTML += `
        <div class="col product-card" data-product-id="${item._id}">
            <div class="card h-100">
                <button type="button"
                    class="btn nav-link p-0 border-0 h-100 d-flex flex-column align-items-center"
                    data-bs-toggle="modal" data-bs-target="#product-view-modal">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body text-center p-2 d-flex flex-column mt-auto">
                            <h5 class="card-title flex-grow-1 d-flex align-items-center justify-content-center">
                                ${item.name}</h5>
                            <strong class="d-block mt-2">Quick View</strong>
                        </div>
                </button>
            </div>
        </div>
      `;
    });

    this.productContainer.innerHTML = '';
    this.productContainer.insertAdjacentHTML('afterbegin', outputHTML);
  }

  clearFilters() {
    const checkedFilters = [...document.querySelectorAll('.filter:checked')];
    checkedFilters.forEach(filter => filter.checked = false);
    const DEFAULT_MAX_PRICE = 2500;
    const priceInput = document.getElementById('priceRange');
    priceInput.value = DEFAULT_MAX_PRICE;
    document.getElementById('currentPrice').innerText = priceInput.value;

    this.hideAllAccordions();
    this.modalInstance.hide();
    this.applyButton.click();
  }

  hideAllAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-collapse');
    accordionItems.forEach(function (item) {
      const collapseInstance = new bootstrap.Collapse(item, {
        toggle: false
      });
      collapseInstance.hide();
    });
  }
}

App.initializeComponents([Navbar, ProductCategory]);
App.hideLoadingIndicator();
