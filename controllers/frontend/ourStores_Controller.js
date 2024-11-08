import StoreCategoryService from "../../services/store/store_category_service.js";
import ProductBrandService from '../../services/store/product_brand_service.js';

export async function displayStoresPage(req, res) {
  try {
    const storeCategories = await StoreCategoryService.getAllCategories();
    const productBrands = await ProductBrandService.getAllBrands();
    
    storeCategories.brands = productBrands;

    res.render('../views/shop/store_locations', {
      categories: storeCategories,
      session: req.session,
      apiKey: process.env.GOOGLE_MAPS_API_KEY
    });
  } catch (error) {
    res.status(500).send('Error loading stores page');
  }
}
