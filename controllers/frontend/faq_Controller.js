import CategoryManager from "../../services/store/category_manager.js";
import BrandManager from '../../services/store/brand_manager.js';

export async function renderFaqPage(req, res) {
  try {
    const allCategories = await CategoryManager.fetchAllCategories();
    const allBrands = await BrandManager.fetchAllBrands();

    // Add brands to categories
    allCategories.brands = allBrands;

    res.render('../views/user/faq', {
      categories: allCategories,
      session: req.session
    });
  } catch (error) {
    console.error('Error loading FAQ page:', error);
    res.status(500).send('An error occurred while loading the FAQ page.');
  }
}
