import CategoryService from '../../../services/store/category_service.js';
import BrandService from '../../../services/store/brand_service.js';

export async function renderProfileSettings(req, res) {
  try {
    // Fetch all categories and brands
    const categories = await CategoryService.getAllCategories();
    const brands = await BrandService.getAllBrands();

    // Attach brands to categories for rendering
    categories.brands = brands;

    // Render the profile settings page
    res.render('../views/user/profile/settings', {
      categories,
      session: req.session,
    });
  } catch (error) {
    // Log the error and respond with a message
    console.error('Error loading profile settings page:', error);
    res.status(500).send('An error occurred while loading the settings page. Please try again later.');
  }
}
