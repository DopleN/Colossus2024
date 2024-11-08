import UserManagement from '../../modules/auth/user_management.js';

export const retrieveUsers = async (req, res) => {
  try {
    const users = await UserManagement.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error("Failed to retrieve users:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const userData = { ...req.body };
    const registeredUser = await UserManagement.addUser(userData);
    res.status(201).json({ success: true, data: registeredUser });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const retrieveUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserManagement.findUser(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Failed to retrieve user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const modifyUser = async (req, res) => {
  const { email } = req.params;
  const updatedUserData = { ...req.body };
  try {
    if (updatedUserData.newEmail) {
      const existingEmail = await UserManagement.findUser(updatedUserData.newEmail);
      if (existingEmail) {
        return res.status(403).json({ success: false, message: "Email is already registered" });
      }
    }

    const modifiedUser = await UserManagement.updateUser(updatedUserData);
    if (!modifiedUser) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }
    res.status(200).json({ success: true, data: modifiedUser });
  } catch (err) {
    console.error("Failed to modify user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const modifyUserRole = async (req, res) => {
  const { email } = req.params;
  try {
    const updatedUserRole = await UserManagement.changeUserRole(email);
    if (!updatedUserRole) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }
    res.status(200).json({ success: true, data: updatedUserRole });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeUser = async (req, res) => {
  const { email } = req.params;
  try {
    const removedUser = await UserManagement.deleteUser(email);
    if (!removedUser) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }
    res.status(200).json({ success: true, data: removedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
