import CategoryManager from '../../services/store/category_manager.js';
import BrandManager from '../../services/store/brand_manager.js';

export async function showLoginPage(req, res) {
  try {
    const categoryList = await CategoryManager.fetchAllCategories();
    const brandList = await BrandManager.fetchAllBrands();

    categoryList.brands = brandList;

    res.render('../views/user/login_page', {
      categories: categoryList, session: req.session
    });
  } catch (error) {
    res.status(500).send('Error loading login page');
  }
}
