import CategoryManager from '../../services/store/category_manager.js';
import ProductManager from '../../services/store/product_manager.js';
import BrandManager from '../../services/store/brand_manager.js';

export async function renderHomePage(req, res) {
  try {
    const categories = await CategoryManager.fetchAllCategories();
    const menProducts = await ProductManager.fetchProductsByGender('men');
    const allBrands = await BrandManager.fetchAllBrands();

    // Add brand names to categories
    categories.brands = allBrands;

    res.render('../views/user/home', {
      categories,
      menProducts,
      session: req.session,
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).send('An error occurred while loading the home page.');
  }
}
