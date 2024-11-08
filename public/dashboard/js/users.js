import Main from '../../frontend/main.js';

class UserManager {
  tableContainer;
  ordersModal;
  modalContent;
  modalInstance;
  
  searchForm;
  searchInput;
  searchButton;
  searchOptions;
  searchModal;
  searchModalContent;
  searchModalInstance;

  usersList = [];

  constructor() {
    this.tableContainer = document.querySelector('.users .col-12');
    this.ordersModal = document.querySelector('#viewOrdersModal');
    this.modalContent = this.ordersModal.querySelector('.modal-body');
    this.modalInstance = new bootstrap.Modal(this.ordersModal, { keyboard: false });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.tableContainer.addEventListener('click', this.handleTableActions.bind(this));
  }

  async handleTableActions(event) {
    this.searchInput.value = '';
    if (event.target.closest('.view-orders-btn')) {
      await this.showUserOrders(event.target.closest('tr').dataset.userId);
      this.searchModalInstance.hide();
    } else if (event.target.closest('.change-role-btn')) {
      await this.updateUserRole(event.target.closest('tr').dataset.userId);
      this.searchModalInstance.hide();
    } else if (event.target.closest('.delete-user-btn')) {
      await this.removeUser(event.target.closest('tr').dataset.userId);
      this.searchModalInstance.hide();
    }
  }

  async renderUserTable() {
    try {
      Main.renderSpinner(this.tableContainer, true);
      this.usersList = await this.fetchUsers();
      Main.renderSpinner(this.tableContainer, false);
      
      const table = document.createElement('table');
      table.classList.add('table', 'table-striped');
      
      const header = document.createElement('thead');
      header.innerHTML = `
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Orders</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      `;
      table.appendChild(header);
      
      const body = document.createElement('tbody');
      this.usersList.forEach((user, index) => {
        const row = document.createElement('tr');
        row.dataset.userId = user.email;
        row.innerHTML = `
          <th>${index + 1}</th>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.email}</td>
          <td>${user.orders.length} orders</td>
          <td>${user.role ? 'Admin' : 'User'}</td>
          <td>
            <button class="btn btn-info btn-sm view-orders-btn">View Orders</button>
            <button class="btn btn-warning btn-sm change-role-btn">Change Role</button>
            <button class="btn btn-danger btn-sm delete-user-btn">Delete</button>
          </td>
        `;
        body.appendChild(row);
      });

      table.appendChild(body);
      this.tableContainer.appendChild(table);
    } catch (error) {
      console.error(error);
      Main.renderSpinner(this.tableContainer, false);
    }
  }

  async showUserOrders(userId) {
    await this.fetchUserOrders(userId);
  }

  async fetchUserOrders(userId) {
    try {
      this.modalInstance.show();
      Main.renderSpinner(this.modalContent, true);
      
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user orders.');
      const { data: user } = await response.json();
      const orderIds = user.orders;
      
      let orders = [];
      for (let orderId of orderIds) {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Failed to fetch orders.');
        const { data: order } = await response.json();
        orders.push(order);
      }

      Main.renderSpinner(this.modalContent, false);
      this.displayUserOrders(orders);
    } catch (error) {
      console.error(error);
    }
  }

  displayUserOrders(orders) {
    this.modalContent.innerHTML = '';
    if (orders.length === 0) {
      const message = document.createElement('p');
      message.classList.add('text-muted');
      message.textContent = 'No orders found for this user.';
      this.modalContent.appendChild(message);
      return;
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-hover');

    const header = document.createElement('thead');
    header.classList.add('table-dark');
    header.innerHTML = `
      <tr>
        <th>Order ID</th>
        <th>Date</th>
        <th>Items</th>
        <th>Total</th>
        <th>Status</th>
      </tr>
    `;
    table.appendChild(header);

    const body = document.createElement('tbody');
    orders.forEach(order => {
      const row = document.createElement('tr');
      const itemsContent = order.cart.map(item => `
        <div class="d-flex align-items-center mb-2">
          <img src="${item.img}" alt="${item.title}" class="img-fluid me-3" style="width: 50px; height: 50px;">
          <div>
            <strong>${item.quantity} x ${item.title}</strong><br>
            Size: ${item.size}<br>
            Price: $${item.price.toFixed(2)}
          </div>
        </div>
      `).join('');
      
      row.innerHTML = `
        <td>${order._id}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>${itemsContent}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td>${order.supplied ? 'Supplied' : 'Pending'}</td>
      `;
      body.appendChild(row);
    });

    table.appendChild(body);
    this.modalContent.appendChild(table);
  }

  async removeUser(userId) {
    try {
      Main.renderSpinner(this.tableContainer, true);
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete user.');
      
      const { success } = await response.json();
      if (success) {
        await this.renderUserTable();
        Main.renderMessage(this.tableContainer, true);
      } else {
        throw new Error('Failed to delete user.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserRole(userId) {
    try {
      let role = document.querySelector('#user-role').dataset.role === 'true';
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });

      if (!response.ok) throw new Error('Failed to change user role.');

      const { success } = await response.json();
      if (success) {
        await this.renderUserTable();
      } else {
        alert('Failed to update user role.');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating user role.');
    }
  }

  async searchUsers(e) {
    e.preventDefault();

    if (!this.usersList.length || !this.searchInput.value) {
      Main.renderMessage(document.querySelector('#searchInput').parentElement, true, 'No users found.');
      setTimeout(() => Main.renderMessage(document.querySelector('#searchInput').parentElement, false), 1000);
      return;
    }

    this.searchModalInstance.show();
    this.searchModalContent.innerHTML = '';
    this.renderSearchResults(this.usersList, 99999);
  }

  async handleSearchInputChange(e) {
    const query = this.searchInput.value;
    if (query.length < 3) return;

    await this.delay(200);

    const users = await this.fetchUsers();
    const regex = new RegExp(query, 'i');
    const filteredUsers = users.filter(user => regex.test(`${user.firstName} ${user.lastName}`));

    this.updateSearchOptions(filteredUsers);
    this.usersList = filteredUsers;
  }

  updateSearchOptions(users) {
    this.searchOptions.innerHTML = '';
    users.forEach(user => {
      this.searchOptions.insertAdjacentHTML('beforeend', `<option value="${user.firstName} ${user.lastName}">`);
    });
  }

  async fetchUsers() {
    try {
      const response = await fetch('/api/users/');
      if (!response.ok) throw new Error('Failed fetching users.');
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  renderSearchResults(data, limit = 6) {
    this.searchModalContent.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');

    const header = document.createElement('thead');
    header.innerHTML = `
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Orders</th>
        <th>Role</th>
        <th>Actions</th>
     
