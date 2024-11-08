import Dashboard from '../../frontend/dashboard.js';

class ProductManager {
  navTabs;
  listContainer;
  addProductSection;
  addProductForm;
  feedbackContainer;
  loadingIndicator;
  supplierDropdown;
  categoryDropdown;
  paginationSection;
  productList = [];

  editSection;
  editForm;
  editSupplierDropdown;
  editCategoryDropdown;

  searchElements;

  constructor() {
    this.navTabs = {
      productListTab: document.querySelector('.tab-product-list'),
      addNewProductTab: document.querySelector('.tab-new-product'),
    };
    this.listContainer = document.querySelector('.product-list-container');
    this.addProductSection = document.querySelector('.add-product-section');
    this.addProductForm = document.querySelector('.new-product-form');
    this.feedbackContainer = document.querySelector('.form-feedback');
    this.loadingIndicator = document.querySelector('.loading-spinner');
    this.supplierDropdown = document.querySelector('#supplier-selector');
    this.categoryDropdown = document.querySelector('#category-selector');
    this.paginationSection = document.querySelector('.pagination-controls');

    this.editSection = document.querySelector('.edit-product-section');
    this.editForm = document.querySelector('.edit-product-form');
    this.editSupplierDropdown = this.editForm.querySelector('#edit-supplier-selector');
    this.editCategoryDropdown = this.editForm.querySelector('#edit-category-selector');

    this.searchElements = {
      searchInput: document.querySelector('#search-field'),
      searchButton: document.querySelector('#search-btn'),
      searchOptions: document.querySelector('#search-suggestions'),
      searchModal: document.querySelector('#search-modal'),
      searchResults: document.querySelector('#search-results'),
    };

    this.fetchProductList();
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.navTabs.productListTab.addEventListener('click', async (event) => {
      if (event.target.classList.contains('active')) return;

      this.highlightTab(event);
      this.displayProductList();

      this.showLoading(true);
      const products = await this.fetchProductList();
      this.showLoading(false);
      this.renderProductList(products);

      this.resetPagination();
      this.paginationSection.classList.remove('hidden');
    });

    this.navTabs.addNewProductTab.addEventListener('click', (event) => {
      this.highlightTab(event);
      this.showAddProductForm();
    });

    this.listContainer.addEventListener('click', async (event) => {
      if (event.target.closest('.delete-product-btn')) {
        this.removeProduct(event);
        return;
      }

      if (event.target.closest('.edit-product-btn')) {
        await this.openEditProductForm(event);
        return;
      }
    });

    this.addProductForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(this.addProductForm);
      const formValues = Object.fromEntries(formData.entries());

      const validatedData = this.validateFormData(formValues, event);

      this.createProduct(validatedData);
    });

    this.supplierDropdown.addEventListener('change', async (event) => await this.handleSupplierSelection(event));
    this.categoryDropdown.addEventListener('change', async (event) => await this.handleCategorySelection(event));
    this.editSupplierDropdown.addEventListener('change', async (event) => await this.handleSupplierSelection(event));
    this.editCategoryDropdown.addEventListener('change', async (event) => await this.handleCategorySelection(event));

    this.editForm.addEventListener('submit', this.handleEditProductSubmit.bind(this));

    this.paginationSection.addEventListener('click', this.handlePaginationClick.bind(this));
  }

  async handleSearchSubmit(event) {
    event.preventDefault();

    if (this.productList.length === 0 || this.searchElements.searchInput.value.trim().length === 0) {
      Dashboard.displayMessage(
        document.querySelector('#search-field').parentElement,
        true,
        'No products found...',
        'afterbegin'
      );
      setTimeout(() => Dashboard.displayMessage(document.querySelector('#search-field').parentElement, false), 1000);
      return;
    }

    this.searchElements.searchModal.show();
    this.searchElements.searchResults.innerHTML = '';
    this.renderSearchResults(this.productList, 99999);
  }

  async handleSearchInputChange(event) {
    const query = this.searchElements.searchInput.value;

    if (query.length < 3) return;

    await this.waitForDelay(200);

    const products = await this.getProductList();

    const searchPattern = new RegExp(query, 'i');

    const filteredProducts = products.filter((product) => searchPattern.test(product.name));

    console.log(filteredProducts); // For debugging

    this.updateSearchSuggestions(filteredProducts);

    this.productList = filteredProducts;
  }

  updateSearchSuggestions(products) {
    this.searchElements.searchOptions.innerHTML = '';
    products.forEach((product) => 
      this.searchElements.searchOptions.insertAdjacentHTML(
        'beforeend',
        `<option value="${product.name}">`
      )
    );
  }

  async getProductList() {
    try {
      const response = await fetch(`/api/products/`);
      if (!response.ok) throw new Error('Failed to load product data');
      const data = await response.json();
      this.productList = data.data;
      return data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  async waitForDelay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  renderSearchResults(data, limit = 6) {
    data.forEach((product, index) => {
      if (index >= limit) return;

      const productElement = document.createElement('div');
      const subCategories = product.category.subcategories.map(subcat => subcat.name);

      productElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      productElement.innerHTML = `
        <div class="card product-card" data-product-id="${product._id}">
          <button type="button" class="btn btn-outline-danger delete-product-btn">Delete</button>
          <img src="${product.image}" class="card-img-top" alt="${product.name}" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">Price: $${product.price}</p>
            <p class="card-text">Sizes: ${product.sizes.join(', ')}</p>
            <p class="card-text">Quantity: ${product.quantity}</p>
            <p class="card-text">Supplier: ${product.supplier.name}</p>
            <p class="card-text">Brand: ${product.brand.name}</p>
            <p class="card-text">Category: ${product.category.name}</p>
            <p class="card-text">Subcategories: ${subCategories.join(', ')}</p>
            <p class="card-text">Gender: ${product.gender}</p>
          </div>
          <button type="button" class="btn btn-outline-secondary edit-product-btn">
            <i class="bi bi-pencil-square"></i>
            <span class="visually-hidden">Edit Product</span>
          </button>
        </div>`;
      this.searchElements.searchResults.appendChild(productElement);
    });
  }

  async handlePaginationClick(event) {
    if (!event.target.closest('.page-link')) return;

    await this.changePage(event);
  }

  resetPagination() {
    [...document.querySelectorAll('.page-link')].forEach((element) => element.classList.remove('active'));
    [...document.querySelectorAll('.page-link')][0].classList.add('active');
  }

  async changePage(event) {
    const productsPerPage = 6;
    const currentPage = event.target.getAttribute('data-page');

    [...document.querySelectorAll('.page-link')].forEach((element) => element.classList.remove('active'));
    event.target.classList.add('active');

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    const productsOnPage = this.productList.slice(startIndex, endIndex);
    this.renderProductList(productsOnPage);
  }

  async openEditProductForm(event) {
    const productId = event.target.closest('.card').getAttribute('data-product-id');
    this.hideAllSections();

    this.editForm.querySelector('#gender-option').selectedIndex = 0;
    this.editForm.setAttribute('data-product-id', productId);

    this.editSection.classList.remove('hidden');
    const product = await this.getProduct(productId);

    // Further product editing code...
  }

  hideAllSections() {
    document.querySelectorAll('.section').forEach((section) => section.classList.add('hidden'));
  }

  async getProduct(productId) {
    const response = await fetch(`/api/products/${productId}`);
    const productData = await response.json();
    return productData;
  }

  showLoading(isLoading) {
    this.loadingIndicator.classList.toggle('hidden', !isLoading);
  }

  renderProductList(products) {
    this.listContainer.innerHTML = '';
    products.forEach((product) => {
      const productElement = document.createElement('div');
      productElement.className = 'product-item';
      productElement.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
      `;
      this.listContainer.appendChild(productElement);
    });
  }

  highlightTab(event) {
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
    event.target.classList.add('active');
  }

  showAddProductForm() {
    this.addProductSection.classList.remove('hidden');
    this.listContainer.classList.add('hidden');
  }
}
class ProductEditor {
  editProductContainer;
  editProductForm;
  editSuppliersOption;
  editCategoriesOption;
  subcategoriesContainer;

  constructor() {
    this.editProductContainer = document.querySelector('.edit-product-container');
    this.editProductForm = this.editProductContainer.querySelector('form');
    this.editSuppliersOption = this.editProductContainer.querySelector('#suppliers-option');
    this.editCategoriesOption = this.editProductContainer.querySelector('#category-option');
    this.subcategoriesContainer = this.editProductContainer.querySelector('.subcategories-container');
  }

  async populateFormData(product) {
    this.showSpinner(true);

    console.log(product);  // Debugging the product

    this.updateInputField('name', product.name);
    this.updateInputField('sizes', product.sizes.join(','));
    this.updateInputField('price', product.price);
    this.updateInputField('quantity', product.quantity);
    this.updateTextArea('description', product.description);
    this.updateInputField('image', product.image);

    await this.selectSupplier(product.supplier.id);
    await this.selectBrand(product.brand.id);
    await this.selectCategory(product.category.id);
    await this.selectSubcategories(product.category.subcategories);
    await this.selectGender(product.gender);

    this.showSpinner(false);
  }

  updateInputField(fieldName, value) {
    this.editProductForm.querySelector(`input[name="${fieldName}"]`).value = value;
  }

  updateTextArea(fieldName, value) {
    this.editProductForm.querySelector(`textarea[name="${fieldName}"]`).value = value;
  }

  async selectSupplier(supplierId) {
    const suppliers = [...this.editSuppliersOption.querySelectorAll('option')].slice(1);
    const matchingSupplierIndex = suppliers.findIndex(supplier => supplier.value == supplierId);
    
    if (matchingSupplierIndex > -1) {
      this.editSuppliersOption.selectedIndex = matchingSupplierIndex + 1;
      await this.handleSupplierChange({ target: this.editSuppliersOption });
    }
  }

  async selectBrand(brandId) {
    const brands = [...this.editProductContainer.querySelector('#brand-option').querySelectorAll('option')].slice(1);
    const matchingBrandIndex = brands.findIndex(brand => brand.value == brandId);
    
    if (matchingBrandIndex > -1) {
      this.editProductContainer.querySelector('#brand-option').selectedIndex = matchingBrandIndex + 1;
    }
  }

  async selectCategory(categoryId) {
    const categories = [...this.editProductContainer.querySelector('#category-option').querySelectorAll('option')].slice(1);
    const matchingCategoryIndex = categories.findIndex(category => category.value == categoryId);
    
    if (matchingCategoryIndex > -1) {
      this.editProductContainer.querySelector('#category-option').selectedIndex = matchingCategoryIndex + 1;
      await this.handleCategoryChange({ target: this.editCategoriesOption });
    }
  }

  async selectSubcategories(subcategories) {
    const subcategoryCheckboxes = [...this.subcategoriesContainer.querySelectorAll('input[type="checkbox"]')];

    subcategoryCheckboxes.forEach(checkbox => {
      const subcatId = checkbox.value;
      checkbox.checked = subcategories.some(subcat => subcat.id === subcatId);
    });
  }

  async selectGender(gender) {
    const genderSelect = this.editProductContainer.querySelector('#gender-option');
    const genderOptions = [...genderSelect.querySelectorAll('option')].slice(1);

    const matchingGenderIndex = genderOptions.findIndex(option => option.value == gender);
    if (matchingGenderIndex > -1) {
      genderSelect.selectedIndex = matchingGenderIndex + 1;
    }
  }

  async handleEditProductFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.editProductForm);
    const formValues = Object.fromEntries(formData.entries());

    const validatedData = this.validateFormData(formValues, event);
    await this.updateProduct(validatedData);
  }

  validateFormData(formValues, event) {
    formValues.sizes = formValues.sizes.split(',').map(item => item.trim());
    formValues.supplier = this.getSupplierData(event);
    formValues.brand = this.getBrandData(event);
    formValues.category = this.getCategoryData(event);
    
    return formValues;
  }

  getSupplierData(event) {
    const selectedSupplier = event.target.closest('.content-container').querySelector('#suppliers-option');
    const selectedOption = selectedSupplier.options[selectedSupplier.selectedIndex];
    
    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-supplier-name')
    };
  }

  getBrandData(event) {
    const selectedBrand = event.target.closest('.content-container').querySelector('#brand-option');
    const selectedOption = selectedBrand.options[selectedBrand.selectedIndex];
    
    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-brand-name')
    };
  }

  getCategoryData(event) {
    const selectedCategory = event.target.closest('.content-container').querySelector('#category-option');
    const selectedOption = selectedCategory.options[selectedCategory.selectedIndex];
    
    const selectedSubcategories = [...document.querySelectorAll('input[data-subcategory-name]:checked')].map(checkbox => ({
      id: checkbox.value,
      name: checkbox.getAttribute('data-subcategory-name')
    }));

    return {
      id: selectedOption.value,
      name: selectedOption.getAttribute('data-category-name'),
      subcategories: selectedSubcategories
    };
  }

  async handleSupplierChange(event) {
    const brandsSelect = event.target.closest('form').querySelector('#brand-option');
    const selectedSupplierId = event.target.value;

    const response = await fetch(`/api/suppliers/${selectedSupplierId}/brands`);

    if (response.status === 404) {
      brandsSelect.innerHTML = `<option value="" disabled selected>No brands available for this supplier</option>`;
      return;
    }

    const { data: supplierBrands } = await response.json();
    this.populateBrandOptions(supplierBrands, brandsSelect);
  }

  populateBrandOptions(brands, brandsSelect) {
    brandsSelect.innerHTML = `<option value="" disabled selected>Please select a brand</option>`;

    brands.forEach(brand => {
      const optionElement = document.createElement('option');
      optionElement.value = brand.id;
      optionElement.setAttribute('data-brand-name', brand.name);
      optionElement.innerText = brand.name;

      brandsSelect.appendChild(optionElement);
    });
  }

  async handleCategoryChange(event) {
    const selectedCategoryId = event.target.value;

    this.clearSubcategoryContainer();
    await this.loadSubcategories(selectedCategoryId);
  }

  clearSubcategoryContainer() {
    this.subcategoriesContainer.innerHTML = '';
  }

  async loadSubcategories(categoryId) {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      const { data: { subcategories } } = await response.json();

      if (subcategories.length === 0) {
        this.subcategoriesContainer.innerHTML = '<p>No subcategories available</p>';
        return;
      }

      this.renderSubcategoryCheckboxes(subcategories);
    } catch (error) {
      console.error('Failed to load subcategories:', error);
      this.subcategoriesContainer.innerHTML = '<p>Failed to load subcategories</p>';
    }
  }

  renderSubcategoryCheckboxes(subcategories) {
    this.subcategoriesContainer.innerHTML = `<label class="form-label mb-2">Select Subcategories</label><br>`;
    
    subcategories.forEach(subcategory => {
      this.subcategoriesContainer.insertAdjacentHTML('beforeend', `
        <input type="checkbox" class="btn-check" id="subcategory-${subcategory._id}" autocomplete="off" data-subcategory-name="${subcategory.name}" value="${subcategory._id}">
        <label class="btn btn-outline-primary" for="subcategory-${subcategory._id}">${subcategory.name}</label><br><br>
      `);
    });
  }

  showSpinner(isVisible) {
    const spinnerElement = this.editProductContainer.querySelector('#spinner-container');
    spinnerElement.classList.toggle('hidden', !isVisible);
  }

  async updateProduct(validatedData) {
    const productId = this.editProductForm.getAttribute('data-product-id');
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(validatedData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('Product updated successfully');
    } else {
      alert('Error updating product');
    }
  }
}
class ProductManager {
  constructor() {
    this.productListContainer = document.getElementById('product-list');
    this.addProductModal = document.getElementById('add-product-modal');
    this.updateProductModal = document.getElementById('update-product-modal');
    this.productForm = document.getElementById('product-form');
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.feedbackMessage = document.getElementById('feedback-message');
    this.paginationContainer = document.getElementById('pagination');
  }

  toggleLoadingIndicator(isVisible) {
    const previousContent = this.loadingIndicator.innerHTML;
    if (isVisible) {
      this.loadingIndicator.innerHTML = `
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>`;
    } else {
      this.loadingIndicator.innerHTML = '';
    }
    return previousContent;
  }

  displayMessage(message) {
    this.feedbackMessage.innerHTML = `<p class="message-text">${message}</p>`;
    setTimeout(() => {
      this.feedbackMessage.classList.add('hidden');
      this.feedbackMessage.innerHTML = '';
    }, 2000);
  }

  showProductList(event) {
    event.preventDefault();
    this.hideAllSections();
    this.productListContainer.classList.remove('hidden');
  }

  showAddProductForm(event) {
    event.preventDefault();
    this.hideAllSections();

    this.resetFormFields();
    this.addProductModal.classList.remove('hidden');
  }

  hideAllSections() {
    document.querySelectorAll('.section-container').forEach(container => {
      if (!container.classList.contains('hidden')) {
        container.classList.add('hidden');
      }
    });
    this.paginationContainer.classList.add('hidden');
  }

  resetFormFields() {
    this.productForm.reset();
    this.addProductModal.querySelector('#brand-select').innerHTML = `<option value="" disabled selected>Select a brand</option>`;
  }

  async fetchProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data.products;
    } catch (error) {
      this.displayMessage(`Error fetching products: ${error.message}`);
    }
  }

  renderProductList(products, limit = 6) {
    this.productListContainer.innerHTML = '';
    if (products.length === 0) {
      this.productListContainer.innerHTML = `<h4>No products available.</h4>`;
      return;
    }

    products.slice(0, limit).forEach(product => {
      const productElement = this.createProductElement(product);
      this.productListContainer.appendChild(productElement);
    });
  }

  createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
    productElement.innerHTML = `
      <div class="card position-relative" data-product-id="${product.id}">
        <button type="button" class="btn btn-outline-danger delete-product">Delete</button>
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text">$${product.price}</p>
        </div>
      </div>`;
    return productElement;
  }

  async createProduct(product) {
    this.feedbackMessage.classList.remove('hidden');
    this.toggleLoadingIndicator(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Failed to add product');
      await response.json();

      this.toggleLoadingIndicator(false);
      this.displayMessage('Product added successfully');
      this.resetFormFields();
      this.showProductList(new Event('click'));
    } catch (error) {
      this.displayMessage('Error adding product.');
      this.toggleLoadingIndicator(false);
    }
  }

  async updateProductDetails(product, productId) {
    const feedbackMessage = this.updateProductModal.querySelector('.feedback-message');
    feedbackMessage.classList.remove('hidden');
    this.toggleLoadingIndicator(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      if (!response.ok) throw new Error('Failed to update product');
      await response.json();

      this.toggleLoadingIndicator(false);
      feedbackMessage.innerHTML = `<p>Product updated successfully</p>`;

      setTimeout(() => {
        feedbackMessage.classList.add('hidden');
        this.showProductList(new Event('click'));
        this.productForm.reset();
      }, 500);
    } catch (error) {
      feedbackMessage.innerHTML = `<p>Error updating product.</p>`;
      setTimeout(() => {
        feedbackMessage.classList.add('hidden');
        this.showProductList(new Event('click'));
        this.productForm.reset();
      }, 500);
    }
  }

  async deleteProductById(event) {
    this.toggleLoadingIndicator(true);

    const productId = event.target.closest('.card').dataset.productId;
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to delete product');
      await response.json();

      const products = await this.fetchProducts();
      this.toggleLoadingIndicator(false);
      this.renderProductList(products);
    } catch (error) {
      console.log(error);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  new ProductManager();
});

function hidePreLoader() {
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  });
}

hidePreLoader();

