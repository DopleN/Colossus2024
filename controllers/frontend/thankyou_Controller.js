import StoreCategoryService from "../../services/store/store_category_service.js";
import ProductBrandService from '../../services/store/product_brand_service.js';

export async function showThankYouPage(req, res) {
  try {
    const categoryList = await StoreCategoryService.fetchAllCategories();
    const brandList = await ProductBrandService.fetchAllBrands();

    categoryList.brands = brandList;

    res.render('../views/user/thank_you', {
      categories: categoryList,
      session: req.session
    });
  } catch (error) {
    res.status(500).send('Error loading thank you page');
  }
}
