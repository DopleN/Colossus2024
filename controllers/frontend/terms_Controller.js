import ProductCategoryService from "../../services/store/product_category_service.js";
import ManufacturerService from '../../services/store/manufacturer_service.js';

export async function showTermsPage(req, res) {
  try {
    const productCategories = await ProductCategoryService.fetchAllCategories();
    const manufacturers = await ManufacturerService.fetchAllBrands();

    productCategories.manufacturers = manufacturers;

    res.render('../views/user/terms_and_conditions', {
      categories: productCategories,
      session: req.session
    });
  } catch (error) {
    res.status(500).send('Error loading terms page');
  }
}
