export async function renderAdminLoginPage(req, res) {
  try {
    // Render the admin login page
    res.render('../views/dashboard/login', {});
  } catch (error) {
    console.error('Error rendering the admin login page:', error);
    res.status(500).send('An error occurred while loading the login page. Please try again later.');
  }
}
