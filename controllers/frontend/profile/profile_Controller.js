import CategoryManager from '../../../services/store/category_manager.js';

export async function renderProfilePage(req, res) {
  try {
    // Redirect to orders page
    return res.redirect('/profile/orders');

    // Uncomment and modify the following code to render profile page with categories if needed
    // const categories = await CategoryManager.fetchAllCategories();
    // res.render('../views/user/profile/profile', { categories, session: req.session });
  } catch (error) {
    console.error('Error rendering profile page:', error);
    res.status(500).send('An error occurred while loading the profile page.');
  }
}
