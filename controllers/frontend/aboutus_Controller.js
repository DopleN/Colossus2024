import ProductCategoryManager from "../../services/store/product_category_manager.js";
import ManufacturerManager from '../../services/store/manufacturer_manager.js';

export async function showAboutPage(req, res) {
  try {
    const categoryList = await ProductCategoryManager.fetchAllCategories();
    const brandList = await ManufacturerManager.fetchAllBrands();

    categoryList.brands = brandList;

    res.render('../views/customer/about_us', {
      categories: categoryList,
      session: req.session
    });
  } catch (error) {
    res.status(500).send('Error loading about page');
  }
}
