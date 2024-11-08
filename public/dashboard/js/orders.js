import Main from '../../frontend/main.js';

class Orders {
  ordersTab;
  suppliedOrderTab;
  ordersContainer;
  suppliedOrdersContainer;

  searchForm;
  searchInput;
  searchBtn;
  searchOptions;
  searchModal;
  searchModalContent;
  searchModalObj;
  orders = [];

  groupByModal;
  groupByBtn;
  groupByModalContent;
  groupByModalObj;

  constructor() {
    this.ordersTab = document.querySelector('.all-orders-tab');

    this.initEventListeners();
  }

  initEventListeners() {
    document.body.addEventListener('click', async (e) => {
      if (e.target.closest('.delete-order')) {
        await this.deleteOrder(
          e.target.closest('.card').getAttribute('data-order-id')
        );
        this.searchModalObj.hide();
        this.groupByModalObj.hide();
        return;
      }
    });

    this.ordersTab.addEventListener('click', this.handleOrdersTabClick.bind(this));
  }

  // GROUPBY START
  async handleGroupByBtnClick(e) {
    e.preventDefault();

    try {
      const response = await fetch('/api/orders/groupby');
      if (!response.ok) throw new Error('Failed to fetch grouped orders.');

      const { data: groupedOrders } = await response.json();
      console.log('Grouped Orders:', groupedOrders);

      this.renderGroupedOrders(groupedOrders);
      this.groupByModalObj.show();
    } catch (error) {
      console.error('Error fetching grouped orders:', error);
    }
  }

  renderGroupedOrders(groupedOrders) {
    this.groupByModalContent.innerHTML = '';
    Object.keys(groupedOrders).forEach((email, idx) => {
      const emailSection = document.createElement('div');
      emailSection.className = 'email-group mb-5';
      emailSection.innerHTML = `<h4>Email: ${groupedOrders[email]._id}</h4>`;

      const ordersRow = document.createElement('div');
      ordersRow.className = 'row';
      console.log(email);

      groupedOrders[email].orders.forEach((order) => {
        const orderElement = document.createElement('div');
        orderElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
        orderElement.innerHTML = `
          <div class="card position-relative" data-order-id="${order._id}">
            ${order.supplied
              ? '<h5 class="text-center p-1">SUPPLIED</h5>'
              : `
            <button type="button" class="btn btn-outline-danger delete-order">X</button>`}
            <div class="card-body">
              <h5 class="card-title">Order ID: ${order._id}</h5>
              <p class="card-text"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
              <p class="card-text"><strong>Email:</strong> ${order.email}</p>
              <p class="card-text"><strong>Address:</strong> ${order.address}</p>
              <p class="card-text"><strong>Country:</strong> ${order.country}</p>
              <p class="card-text"><strong>Zip:</strong> ${order.zip}</p>
              <p class="card-text"><strong>CC Name:</strong> ${order.paymentDetails.ccName}</p>
              <p class="card-text"><strong>CC Number:</strong> ${order.paymentDetails.ccNumber}</p>
              <p class="card-text"><strong>CC Expiration:</strong> ${order.paymentDetails.ccExpiration}</p>
              <p class="card-text"><strong>CC CVV:</strong> ${order.paymentDetails.ccCvv}</p>
              <h6 class="card-subtitle mb-2 text-muted">Cart Items</h6>
              <ul class="list-group list-group-flush mb-3">
                ${order.cart
                  .map((item) => `
                    <li class="list-group-item">
                      <strong>${item.title}</strong> - Size: ${item.size}, Qty: ${item.quantity}, Price: $${item.price}
                    </li>`)
                  .join('')}
              </ul>
              <h6 class="card-subtitle mb-2 text-muted">Total: $${order.cart
                    .reduce((total, item) => total + item.price * item.quantity, 0)
                    .toFixed(2)}</h6>
              <h6 class="card-subtitle mb-2 text-muted">Ordered By: ${order.orderedBy || 'Temp User'}</h6>
            </div>
            ${order.supplied
              ? '<h5 class="text-center p-1">SUPPLIED</h5>'
              : `<button type="button" class="btn btn-outline-primary supplied-order-btn">
                    <i class="bi bi-check-circle"></i>
                    <span class="visually-hidden">Supplied Order</span>
                  </button>`}
          </div>
        `;
        ordersRow.appendChild(orderElement);
      });

      emailSection.appendChild(ordersRow);
      this.groupByModalContent.appendChild(emailSection);
    });
  }

  // GROUPBY END

  // SEARCH START
  handleSearchClick(e) {
    e.preventDefault();

    if (this.orders.length == 0 || this.searchInput.value.length == 0) {
      Main.renderMessage(document.querySelector('#searchInput').parentElement, true, 'No orders found..', 'afterbegin');
      setTimeout(() => Main.renderMessage(document.querySelector('#searchInput').parentElement, false), 1000);
      return;
    }

    this.searchModalObj.show();
    this.searchModalContent.innerHTML = '';
    this.renderSearchOrders(this.orders, 99999);
  }

  async handleSearchInputChange(e) {
    const searchQuery = this.searchInput.value;

    if (searchQuery.length < 3) return;

    await this.delay(200);

    const orders = await this.getOrders();
    const regex = new RegExp(searchQuery, 'i');
    const orderEmails = [...new Set(orders.map((order) => order.email))];
    const filteredByOrder = orders.filter((order) => regex.test(`${order.email}`));
    const filterEmails = orderEmails.filter((email) => regex.test(`${email}`));

    this.updateDataList(filterEmails);
    this.orders = filteredByOrder;
    console.log(this.orders);
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  updateDataList(emails) {
    this.searchOptions.innerHTML = '';
    emails.forEach((email) =>
      this.searchOptions.insertAdjacentHTML('beforeend', `<option value="${email}">`)
    );
  }

  renderSearchOrders(data, limit = 6) {
    this.searchModalContent.innerHTML = '';
    let hasUnfulfilledOrders = false;

    data.forEach((order, idx) => {
      if (idx >= limit) return;

      const orderElement = document.createElement('div');
      orderElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      orderElement.innerHTML = `
        <div class="card position-relative" data-order-id="${order._id}">
          ${order.supplied
            ? '<h5 class="text-center p-1">SUPPLIED</h5>'
            : `<button type="button" class="btn btn-outline-danger delete-order">X</button>`}
          <div class="card-body">
            <h5 class="card-title">Order ID: ${order._id}</h5>
            <p class="card-text"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
            <p class="card-text"><strong>Email:</strong> ${order.email}</p>
            <p class="card-text"><strong>Address:</strong> ${order.address}</p>
            <p class="card-text"><strong>Country:</strong> ${order.country}</p>
            <p class="card-text"><strong>Zip:</strong> ${order.zip}</p>
            <p class="card-text"><strong>CC Name:</strong> ${order.paymentDetails.ccName}</p>
            <p class="card-text"><strong>CC Number:</strong> ${order.paymentDetails.ccNumber}</p>
            <p class="card-text"><strong>CC Expiration:</strong> ${order.paymentDetails.ccExpiration}</p>
            <p class="card-text"><strong>CC CVV:</strong> ${order.paymentDetails.ccCvv}</p>
            <h6 class="card-subtitle mb-2 text-muted">Cart Items</h6>
            <ul class="list-group list-group-flush mb-3">
              ${order.cart
                .map((item) => `
                  <li class="list-group-item">
                    <strong>${item.title}</strong> - Size: ${item.size}, Qty: ${item.quantity}, Price: $${item.price}
                  </li>`)
                .join('')}
            </ul>
            <h6 class="card-subtitle mb-2 text-muted">Total: $${order.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h6>
          </div>
          ${order.supplied
            ? '<h5 class="text-center p-1">SUPPLIED</h5>'
            : `<button type="button" class="btn btn-outline-primary supplied-order-btn">
                <i class="bi bi-check-circle"></i>
                <span class="visually-hidden">Supplied Order</span>
              </button>`}
        </div>
      `;
      this.searchModalContent.appendChild(orderElement);

      if (!order.supplied) {
        hasUnfulfilledOrders = true;
      }
    });

    if (!hasUnfulfilledOrders) {
      Main.renderMessage(this.searchModalContent, true, 'No unfulfilled orders found...', 'afterbegin');
    }
  }
}
