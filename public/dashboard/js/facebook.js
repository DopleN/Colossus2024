import Core from '../../frontend/core.js';

class SocialMedia {
  tabElement;
  identifier;
  accessTokenForPage;
  token;

  constructor() {
    this.setupEventListeners();
    this.initializeData();
  }

  setupEventListeners() {
    this.tabElement = document.querySelector('.tabs');
    this.tabElement.addEventListener('click', this.onTabSelect.bind(this));
  }

  async initializeData() {
    try {
      await this.fetchToken();
      const { identifier, accessTokenForPage } = await this.retrievePageToken();
      this.identifier = identifier;
      this.accessTokenForPage = accessTokenForPage;

      console.log('Identifier:', this.identifier);
      console.log('Page Token:', this.accessTokenForPage);

      await this.fetchProducts();
      document.getElementById('postForm').addEventListener('submit', this.submitPost.bind(this));
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async onTabSelect(event) {
    const selectedContainer = event.target.getAttribute('data-target');
    const tabs = [...document.querySelectorAll('.tab')];
    const containers = [...document.querySelectorAll('.api-container')];

    if (event.target.classList.contains('active')) return;

    containers.forEach(container => container.classList.add('hidden'));
    document.querySelector(`#${selectedContainer}`).classList.remove('hidden');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.closest('.tab').classList.add('active');

    if (selectedContainer === 'posts-view') {
      await this.fetchPosts();
    }
  }

  async fetchPosts() {
    const displayContainer = document.querySelector('#posts-view');

    try {
      Core.showLoader(displayContainer, true);
      const response = await fetch(`https://graph.socialmedia.com/v12.0/${this.identifier}/posts?access_token=${this.accessTokenForPage}&fields=message,created_time,full_picture,id`);
      const data = await response.json();
      Core.showLoader(displayContainer, false);

      if (data && data.data) {
        displayContainer.innerHTML = '';
        data.data.forEach(post => this.createPostElement(post, displayContainer));
      } else {
        this.noPostsFound(displayContainer);
      }
    } catch (error) {
      this.handleError(displayContainer, 'Unable to fetch posts', error);
    }
  }

  createPostElement(post, displayContainer) {
    const postCard = document.createElement('div');
    postCard.className = 'post-entry';
    postCard.innerHTML = `
      <div class="card mb-4 shadow-sm">
        <div class="row g-0">
          ${post.full_picture ? `
            <div class="col-md-4">
              <img src="${post.full_picture}" class="img-fluid rounded-start" alt="Post image" style="height: 100%; object-fit: cover;">
            </div>
          ` : ''}
          <div class="col-md-8">
            <div class="card-body">
              <p class="card-text mb-2">${post.message ? post.message.split('\n')[0] : 'No content available'}</p>
              <div class="card-text">
                ${this.extractPostDetails(post.message)}
              </div>
              <p class="card-text"><small class="text-muted">Posted on: ${new Date(post.created_time).toLocaleString()}</small></p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <a href="https://www.socialmedia.com/${post.id}" target="_blank" class="btn btn-primary btn-sm">View Post</a>
                <button class="btn btn-danger btn-sm remove-post-btn" data-post-id="${post.id}">Remove Post</button>
                <small class="text-muted">Social Media</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    displayContainer.appendChild(postCard);
    postCard.querySelector('.remove-post-btn').addEventListener('click', this.removePost.bind(this));
  }

  extractPostDetails(message) {
    let details = '';
    if (message.includes('Item Name:')) {
      details += `<p><strong>Item Name:</strong> ${message.split('Item Name:')[1].split('\n')[0]}</p>`;
    }
    if (message.includes('Cost:')) {
      details += `<p><strong>Cost:</strong> $${message.split('Cost:')[1].split('\n')[0]}</p>`;
    }
    if (message.includes('Sizes Available:')) {
      details += `<p><strong>Sizes Available:</strong> ${message.split('Sizes Available:')[1].split('\n')[0]}</p>`;
    }
    return details;
  }

  noPostsFound(displayContainer) {
    Core.showLoader(displayContainer, false);
    Core.displayMessage(displayContainer, true, 'No posts available for this page.', 'beforeend');
    setTimeout(() => Core.displayMessage(displayContainer, false), 2000);
  }

  handleError(displayContainer, msg, error) {
    Core.showLoader(displayContainer, false);
    Core.displayMessage(displayContainer, true, `${msg}: ${error.message}`, 'beforeend');
    setTimeout(() => Core.displayMessage(displayContainer, false), 2000);
    console.error(msg, error);
  }

  async removePost(event) {
    const postId = event.target.getAttribute('data-post-id');
    const displayContainer = document.querySelector('#posts-view');

    try {
      Core.showLoader(displayContainer, true);
      const response = await fetch(`https://graph.socialmedia.com/v12.0/${postId}?access_token=${this.accessTokenForPage}`, { method: 'DELETE' });
      Core.showLoader(displayContainer, false);

      if (response.ok) {
        Core.displayMessage(displayContainer, true, 'Post removed successfully!', 'beforeend');
        setTimeout(() => Core.displayMessage(displayContainer, false), 2000);
        event.target.closest('.post-entry').remove();
      } else {
        throw new Error('Unable to remove post');
      }
    } catch (error) {
      this.handleError(displayContainer, 'Error removing post', error);
    }
  }

  async fetchToken() {
    try {
      const response = await fetch('/api/auth-token');
      const data = await response.json();
      this.token = data.token;
      console.log('Token:', this.token);
    } catch (error) {
      console.error('Token fetch error:', error);
      alert('Failed to fetch access token');
    }
  }

  async retrievePageToken() {
    try {
      const response = await fetch(`https://graph.socialmedia.com/me/accounts?access_token=${this.token}`);
      const data = await response.json();

      if (data && data.data && data.data.length > 0) {
        const pageData = data.data[0];
        return { identifier: pageData.id, accessTokenForPage: pageData.access_token };
      } else {
        throw new Error('No pages associated with this account.');
      }
    } catch (error) {
      console.error('Page token fetch error:', error);
      alert('Failed to retrieve page access token');
    }
  }

  async fetchProducts() {
    try {
      const response = await fetch('/api/item-list');
      const { data: items } = await response.json();
      const productDropdown = document.getElementById('productDropdown');

      items.forEach(item => {
        const optionElement = document.createElement('option');
        optionElement.value = JSON.stringify(item);
        optionElement.textContent = item.name;
        productDropdown.appendChild(optionElement);
      });
    } catch (error) {
      console.error('Product fetch error:', error);
    }
  }

  async submitPost(event) {
    event.preventDefault();

    const postData = new FormData();
    let message = document.getElementById('content').value;
    const chosenProduct = JSON.parse(document.getElementById('productDropdown').value);

    if (document.getElementById('includeItemName').checked) {
      message += `\nItem Name: ${chosenProduct.name}`;
    }
    if (document.getElementById('includeItemCost').checked) {
      message += `\nCost: $${chosenProduct.price.toFixed(2)}`;
    }
    if (document.getElementById('includeItemSizes').checked) {
      message += `\nSizes Available: ${chosenProduct.sizes.join(', ')}`;
    }

    postData.append('message', message);
    postData.append('url', chosenProduct.image);

    const postFormElement = document.querySelector('#postForm');
    try {
      Core.showLoader(postFormElement, true);
      const response = await fetch(`https://graph.socialmedia.com/v12.0/${this.identifier}/photos?access_token=${this.accessTokenForPage}`, {
        method: 'POST',
        body: postData
      });

      const result = await response.json();
      Core.showLoader(postFormElement, false);

      if (response.ok && result.id) {
        Core.displayMessage(postFormElement, true, 'Post created successfully!', 'beforeend');
        setTimeout(() => Core.displayMessage(postFormElement, false), 2000);
      } else {
        Core.displayMessage(postFormElement, true, `Failed to create post: ${result.error.message}`, 'beforeend');
        setTimeout(() => Core.displayMessage(postFormElement, false), 2000);
      }
    } catch (error) {
      Core.showLoader(postFormElement, false);
      Core.displayMessage(postFormElement, true, `Error posting: ${error.message}`, 'beforeend');
      setTimeout(() => Core.displayMessage(postFormElement, false), 2000);
      console.error('Posting error:', error);
    }
  }
}

Core.initializeComponents([SocialMedia]);
Core.hideLoadingIndicator();
