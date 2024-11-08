export async function showFacebookPage(req, res) {
  try {
    res.render('../views/social/facebook_page', {});
  } catch (error) {
    res.status(500).send('Error loading Facebook page');
  }
}
