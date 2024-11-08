export async function showLaunchPage(req, res) {
  try {
    res.render('../views/pages/launch_overview', {});
  } catch (error) {
    res.status(500).send('Error loading the launch page');
  }
}
