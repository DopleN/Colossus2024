import AuthService from '../services/auth_service.js';

// Middleware to ensure the user is logged in
export async function mustLogin(req, res, next) {
  if (req.session.userId) {
    try {
      const user = await AuthService.getUser(req.session.email);
      if (!user) {
        req.session.destroy((err) => {
          if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Error during logout' });
          }
          return res.redirect('/login');
        });
      } else {
        return next();
      }
    } catch (err) {
      console.error('Error checking user session:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.redirect('/login');
  }
}

// Middleware to prevent logged-in users from accessing login page
export function alreadyLoggedIn(req, res, next) {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
}

// Middleware to ensure the user is an admin
export function isAdmin(req, res, next) {
  if (!req.session.role || req.session.role !== 'admin') {
    return res.redirect('/dashboard/login');
  }
  console.log('Admin access granted');
  next();
}

// Logout user and destroy the session
export function logout(req, res) {
  req.session.destroy((err
