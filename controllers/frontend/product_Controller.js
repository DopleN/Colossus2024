import StoreCategoryService from "../../services/store/store_category_service.js";
import ItemService from "../../services/store/item_service.js";
import ManufacturerService from '../../services/store/manufacturer_service.js';

export async function displayProductPage(req, res) {
  const { productName } = req.params;
  try {
    const categoryList = await StoreCategoryService.fetchAllCategories();
    const brandList = await ManufacturerService.fetchAllBrands();
    categoryList.brands = brandList;
    
    const productDetails = await ItemService.getProductByName(productName);

    res.render('../views/shop/product_page', {
      categories: categoryList,
      product: productDetails,
      session: req.session
    });
  }
  catch (error) {
    res.redirect('/not-found');
  }
}

export async function redirectToProduct(req, res) {
  const { productId } = req.params;
  try {
    const productDetails = await ItemService.getProductById(productId);
    res.redirect(`/product/${productDetails.name.toLowerCase()}`);
  } catch (error) {
    console.error(error);
    res.redirect('/not-found');
  }
}
