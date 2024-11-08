import CategoryManager from "../../services/store/category_manager.js";
import BrandManager from '../../services/store/brand_manager.js';

export async function renderAccessibilityPage(req, res) {
  try {
    const categoryList = await CategoryManager.fetchAllCategories();
    const brandList = await BrandManager.fetchAllBrands();

    categoryList.brands = brandList;

    res.render('../views/user/accessibility', {
      categories: categoryList,
      session: req.session
    });
  } catch (error) {
    console.error("Error loading accessibility page:", error);
    res.status(500).send('Unable to load the accessibility page at this time.');
  }
}
