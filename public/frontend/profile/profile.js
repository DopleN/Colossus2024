import Main from '../main.js';
import Header from '../header.js';

class Profile {
  constructor() {
    this.profileContainer = document.querySelector('#profile-container'); // Assuming there's a container for the profile data
    this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      const response = await fetch('/profile/data'); // Adjust the endpoint to match your API
      if (!response.ok) {
        throw new Error('Failed to load profile data.');
      }

      const data = await response.json();
      this.renderProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      this.profileContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  }

  renderProfile(data) {
    this.profileContainer.innerHTML = `
      <h2>Your Profile</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <img src="${data.profilePicture || '/default-avatar.png'}" alt="Profile Picture" class="profile-picture" />
      <button class="btn btn-primary" id="edit-profile-btn">Edit Profile</button>
    `;

    document.getElementById('edit-profile-btn').addEventListener('click', () => this.editProfile(data));
  }

  editProfile(data) {
    // Logic to open an edit form pre-filled with current data
    console.log('Edit profile logic goes here:', data);
    // You could create a modal or a new form section for editing
  }
}

Main.initComponents([Header, Profile]);

Main.hidePreLoader();
