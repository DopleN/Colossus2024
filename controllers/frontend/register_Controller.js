import ProductCategoryService from '../../services/store/product_category_service.js';
import ManufacturerService from '../../services/store/manufacturer_service.js';

export async function showRegistrationPage(req, res) {
  try {
    const categoryList = await ProductCategoryService.fetchAllCategories();
    const brandList = await ManufacturerService.fetchAllBrands();

    categoryList.brands = brandList;

    res.render('../views/user/register_page', {
      categories: categoryList,
      session: req.session
    });
  } catch (error) {
    res.status(500).send('Error loading registration page');
  }
}
