document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submission prevented');

    // Display success message
    const h2Element = document.querySelector('.card h2');
    h2Element.textContent = 'Your message has been sent successfully ✔';
    h2Element.classList.add('success-message-style'); // Add a class for styling

    // Reset the form
    event.target.reset();
    console.log('Form reset');
});
