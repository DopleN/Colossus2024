import OrderManagement from './dashboard/orderManagement.js';
import { UserModel } from '../models/userModel.js';

const authenticate = async (userEmail, userPassword) => {
  if (!userEmail || !userPassword) {
    throw new Error('Both email and password are mandatory.');
  }

  try {
    const userAccount = await UserModel.findOne({ email: userEmail, password: userPassword });
    return userAccount;
  } catch (err) {
    console.error('Authentication error:', err);
    throw new Error('Login unsuccessful.');
  }
};

const createAccount = async (newUser) => {
  if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
    throw new Error('All fields must be filled.');
  }

  try {
    const existingUser = await fetchUser(newUser.email);
    if (existingUser) return null;

    const userRecord = new UserModel(newUser);
    await userRecord.save();
    console.log('Account created successfully:', userRecord);

    return userRecord;

  } catch (err) {
    console.error('Registration error:', err);
    throw new Error('Registration unsuccessful.');
  }
};

const fetchUser = async (userEmail) => {
  return await UserModel.findOne({ email: userEmail });
};

const fetchAllUsers = async () => {
  try {
    return await UserModel.find();
  } catch (err) {
    console.error('Error retrieving users:', err);
    throw new Error('Unable to fetch users.');
  }
};

const modifyUser = async (userDetails) => {
  if (!userDetails.email || !userDetails.firstName || !userDetails.lastName || !userDetails.currentPassword || !userDetails.newPassword) {
    throw new Error('All fields must be filled.');
  }

  try {
    const existingUser = await fetchUser(userDetails.email);
    if (!existingUser) return null;

    const isPasswordValid = userDetails.currentPassword === existingUser.password;
    if (!isPasswordValid) {
      throw new Error('Invalid current password.');
    }

    existingUser.firstName = userDetails.firstName;
    existingUser.lastName = userDetails.lastName;
    existingUser.password = userDetails.newPassword;
    
    if (userDetails.newEmail) {
      const userOrders = await OrderManagement.getOrdersByIds(existingUser.orders);
      for (const order of userOrders) {
        order.orderedBy = userDetails.newEmail;
        await order.save();
      }
      existingUser.email = userDetails.newEmail;
    }

    if (userDetails.orders)
      existingUser.orders = userDetails.orders;

    await existingUser.save();
    console.log('User details updated successfully:', existingUser);

    return existingUser;

  } catch (err) {
    console.error('Error updating user:', err);
    throw new Error(err.message);
  }
};

const toggleUserRole = async (userEmail) => {
  try {
    const user = await fetchUser(userEmail);
    const currentRole = user.role;

    user.role = !currentRole;

    await user.save();
    return user;
  } catch (err) {
    console.error('Error changing user role:', err);
    throw new Error(err.message);
  }
};

const updateUserOrders = async (user, orderList) => {
  try {
    user.orders = orderList;
    await user.save();
    return user;
  } catch (err) {
    console.error('Error updating user orders:', err);
    throw new Error(err.message);
  }
};

const findUserByOrderId = async (userEmail, orderId) => {
  try {
    return await UserModel.findOne({ email: userEmail, orders: orderId });
  } catch (err) {
    console.error('Error retrieving user by order ID:', err);
    throw err;
  }
};

const removeUser = async (userEmail) => {
  if (!userEmail) {
    throw new Error('User email is required for deletion.');
  }

  try {
    const userToDelete = await UserModel.findOneAndDelete({ email: userEmail });
    if (!userToDelete) {
      throw new Error('User not found.');
    }

    for (const orderId of userToDelete.orders) {
      try {
        await OrderManagement.deleteOrder(orderId);
      } catch (orderErr) {
        console.error(`Failed to delete order ${orderId}:`, orderErr);
      }
    }

    console.log('User successfully deleted:', userToDelete);
    return userToDelete;

  } catch (err) {
    console.error('Deletion error:', err);
    throw new Error('User deletion unsuccessful.');
  }
};

export default {
  authenticate,
  createAccount,
  modifyUser,
  fetchUser,
  fetchAllUsers,
  updateUserOrders,
  findUserByOrderId,
  removeUser,
  toggleUserRole
};
s