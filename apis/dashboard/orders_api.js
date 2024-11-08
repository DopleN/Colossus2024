import OrderProcessor from '../../services/dashboard/order_processor.js';
import UserAuth from '../../services/user_auth.js';
import { UsersModel } from '../../models/user.js';

// Fetch all orders
export async function listAllOrders(req, res) {
  try {
    const orders = await OrderProcessor.retrieveOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Add a new order
export async function addOrder(req, res) {
  try {
    const orderData = { ...req.body };
    if (req.session.userId) orderData.placedBy = req.session.email;

    const createdOrder = await OrderProcessor.addNewOrder(orderData);

    if (req.session.userId) {
      const user = await UserAuth.findUser(req.session.email);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      user.orders.push(createdOrder._id);
      const updatedUserOrders = user.orders;
      await UserAuth.updateUserOrderHistory(user, updatedUserOrders);
    }
    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Fetch a single order by ID
export async function fetchOrderById(req, res) {
  const { id } = req.params;
  try {
    const order = await OrderProcessor.retrieveOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Update an order by ID
export async function modifyOrder(req, res) {
  const { id } = req.params;
  const updatedOrderData = { ...req.body };

  try {
    const order = await OrderProcessor.updateOrderById(id, updatedOrderData);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Remove an order by ID
export async function removeOrderById(req, res) {
  const { id } = req.params;
  try {
    const deletedOrder = await OrderProcessor.deleteOrderById(id);

    const orderingUser = await UserAuth.findUser(deletedOrder.placedBy);
    if (orderingUser) {
      orderingUser.orders.pull(deletedOrder._id);
      await orderingUser.save();
      console.log(`Order ${deletedOrder._id} removed from user ${orderingUser.email}`);
    }

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Group orders by user email
export async function groupOrdersByUserEmail(req, res) {
  try {
    const groupedOrders = await OrderProcessor.groupOrdersByEmail();
    res.status(200).json({ success: true, data: groupedOrders });
  } catch (error) {
    console.error('Error grouping orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// List orders by creation date in ascending order
export async function listOrdersAscending(req, res) {
  try {
    const orders = await OrderProcessor.retrieveOrdersInAsc();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error listing orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
