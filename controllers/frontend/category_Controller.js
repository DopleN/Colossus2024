import CategoryManager from "../../services/store/category_manager.js";
import ProductManager from "../../services/store/product_manager.js";
import BrandManager from "../../services/store/brand_manager.js";

// Renders the category page with products and brands
export async function showCategoryPage(req, res) {
  const { name } = req.params;
  try {
    const categories = await CategoryManager.getAllCategories();
    const category = await CategoryManager.getCategoryByName(name);
    const categoryProducts = await ProductManager.getProductsByCategoryId(category._id);
    const brands = await BrandManager.getAllBrands();

    categories.brands = brands;

    res.render('../views/shop/category_page', {
      categories,
      category,
      categoryProducts,
      brands,
      session: req.session,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
}

// Handles requests for subcategories by redirecting to the corresponding category page
export async function showSubCategoryPage(req, res) {
  const { s
