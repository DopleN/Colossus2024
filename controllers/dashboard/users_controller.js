import UserManager from '../../services/user_manager.js';

export async function fetchUsers(req, res) {
  try {
    const usersList = await UserManager.retrieveAllUsers();
    res.render('../views/admin/user_list', {
      users: usersList,
    });
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
}
