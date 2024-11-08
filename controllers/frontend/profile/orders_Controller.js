import CategoryManager from '../../../services/store/category_manager.js';
import AuthManager from '../../../services/auth_manager.js';
import OrderManager from '../../../services/store/order_manager.js';
import BrandManager from '../../../services/store/brand_manager.js';

export async function renderProfileOrders(req, res) {
  try {
    const allCategories = await CategoryManager.fetchAllCategories();
    const user = await AuthManager.getUserByEmail(req.session.email);

    const orders = await OrderManager.fetchOrdersByIds(user.orders);
    const allBrands = await BrandManager.fetchAllBrands();

    // Assign brands to categories
    allCategories.brands = allBrands;

    console.log(orders); // Log orders for debugging

    res.render('../views/user/profile/orders', {
      categories: allCategories,
      session: req.session,
      orders,
    });
  } catch (error) {
    console.error('Error loading profile orders:', error);
    res.status(500).send('An error occurred while loading your orders.');
  }
}
