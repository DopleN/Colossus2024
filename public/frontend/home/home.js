async handleGenderLinkClick(e) {
    try {
        const target = e.target;
        if (target.classList.contains('active')) return;

        const genderLinks = document.querySelectorAll('.gender-link');

        // Disable all links during loading
        genderLinks.forEach(link => link.classList.add('disabled'));

        const gender = target.getAttribute('data-gender');

        Main.renderSpinner(this.recentProducts, true);
        const productsByGender = await this.getProductsByGender(gender);
        Main.renderSpinner(this.recentProducts, false);

        // Remove 'active' class from all links and add to the clicked one
        genderLinks.forEach(link => link.classList.remove('active'));
        this.renderProducts(productsByGender);
        target.classList.add('active');

        // If no products are found, display a message
        if (productsByGender.length === 0) {
            Main.renderMessage(this.recentProducts, true, 'No products found for this category.', 'beforebegin');
            setTimeout(() => {
                Main.renderMessage(this.recentProducts, false);
            }, 2000);
        }

    } catch (e) {
        Main.renderSpinner(this.recentProducts, false);
        console.error(e);
        if (Main.messageVisible) return;
        Main.renderMessage(this.recentProducts, true, e.message || 'An error occurred.', 'beforebegin');
        setTimeout(() => {
            Main.renderMessage(this.recentProducts, false);
        }, 2000);
    } finally {
        // Re-enable links after loading
        const genderLinks = document.querySelectorAll('.gender-link');
        genderLinks.forEach(link => link.classList.remove('disabled'));
    }
}
