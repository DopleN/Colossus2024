export async function showAnalyticsDashboard(req, res) {
  try {
    res.render('../views/insights/analytics_dashboard', {});
  } catch (error) {
    res.status(500).send('Error loading analytics dashboard');
  }
}
