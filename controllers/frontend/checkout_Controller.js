import CategoryManager from "../../services/store/category_manager.js";
import BrandManager from '../../services/store/brand_manager.js';

export async function renderCheckoutPage(req, res) {
  try {
    const allCategories = await CategoryManager.getAllCategories();
    const allBrands = await BrandManager.getAllBrands();
    
    // Assign brands to categories
    allCategories.brands = allBrands;

    res.render('../views/shop/checkout', {
      categories: allCategories,
      session: req.session
    });
  } catch (error) {
    console.error('Error loading checkout page:', error);
    res.status(500).send('An error occurred while loading the checkout page.');
  }
}
