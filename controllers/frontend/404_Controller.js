import CategoryManager from "../../services/store/category_manager.js";
import BrandManager from '../../services/store/brand_manager.js';

export async function renderThankYouPage(req, res) {
  try {
    const categories = await CategoryManager.getAllCategories();
    const brands = await BrandManager.getAllBrands();

    categories.brands = brands;

    res.render('../views/customer/thank_you', {
      
