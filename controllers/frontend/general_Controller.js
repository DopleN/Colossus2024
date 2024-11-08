export async function renderGeneralPage(req, res) {
  try {
    res.render('../views/user/general', {});
  } catch (error) {
    console.error('Error loading general page:', error);
    res.status(500).send('An error occurred while loading the general page.');
  }
}
