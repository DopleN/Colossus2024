import StoreCategoryService from "../../services/store/store_category_service.js";
import ProductBrandService from '../../services/store/product_brand_service.js';

export async function showShippingPage(req, res) {
  try {
    const categoryList = await StoreCategoryService.fetchAllCategories();
    const brandList = await ProductBrandService.fetchAllBrands();

    categoryList.brands = brandList;

    res.render('../views/shop/shipping_info', {
      categories: categoryList,
     
