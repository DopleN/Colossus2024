async updateUser(user) {
  console.log(user);
  try {
    Main.renderSpinner(this.settingsFormBtn, true);
    this.settingsFormBtn.setAttribute('disabled', 'disabled'); // Disable button to prevent multiple submissions
    const response = await fetch('/profile/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message);
    }

    const data = await response.json();
    Main.renderSpinner(this.settingsFormBtn, false);
    console.log('User updated successfully:', data);

    Main.renderMessage(this.settingsForm, true, 'Updated your information successfully.', 'beforeend');
    setTimeout(() => window.location.href = '/profile', 1000);

  } catch (error) {
    Main.renderSpinner(this.settingsFormBtn, false);
    this.settingsFormBtn.removeAttribute('disabled'); // Re-enable the button
    console.error('Error updating user:', error);
    Main.renderMessage(this.settingsForm, true, `Error: ${error.message}`, 'beforeend');
    setTimeout(() => Main.renderMessage(this.settingsForm, false), 3000); // Show error longer
  }
}
