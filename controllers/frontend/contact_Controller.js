import BrandManager from '../../services/store/brand_manager.js';

export async function renderHomePage(req, res) {
  try {
    const allBrands = await BrandManager.fetchAllBrands();

    res.render('../views/user/home', {
      brands: allBrands,
      session: req.session
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).send('An error occurred while loading the home page.');
  }
}
