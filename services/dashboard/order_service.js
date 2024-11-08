import AuthService from '../auth_service.js';
import { OrdersModel } from '../../models/dashboard/order.js';

const fetchOrders = async () => {
  try {
    return await OrdersModel.find();
  } catch (error) {
    console.error('Error retrieving orders:', error);
    throw new Error('Unable to retrieve orders');
  }
};

const fetchOrderById = async (orderId) => {
  try {
    const order = await OrdersModel.findById(orderId);
    if (!order) throw new Error('Order not found');
    return order;
  } catch (error) {
    console.error(`Error finding order with ID ${orderId}:`, error);
    throw new Error('Unable to retrieve order');
  }
};

const addOrder = async (orderData) => {
  try {
    const { firstName, lastName, email, address, country, zip, ccName, ccNumber, ccExpiration, ccCvv, cart, total, orderedBy } = orderData;

    const validatedOrder = {
      firstName,
      lastName,
      email,
      address,
      country,
      zip,
      paymentDetails: { ccName, ccNumber, ccExpiration, ccCvv },
      cart,
      total,
      orderedBy
    };

    const newOrder = new OrdersModel(validatedOrder);
    return await newOrder.save();
  } catch (error) {
    console.error('Error saving order:', error);
    throw new Error('Unable to save order');
  }
};

const removeOrder = async (orderId) => {
  try {
    const deletedOrder = await OrdersModel.findByIdAndDelete(orderId);
    if (!deletedOrder) throw new Error('Order not found');

    const userWhoOrdered = await AuthService.findUserWhoOrderedSpecificOrder(deletedOrder.orderedBy, orderId);
    if (userWhoOrdered) {
      const updatedOrders = userWhoOrdered.orders.filter(id => id.toString() !== orderId.toString());
      await AuthService.updateUserOrders(userWhoOrdered, updatedOrders);
    }

    return deletedOrder;
  } catch (error) {
    console.error(`Error deleting order with ID ${orderId}:`, error);
    throw new Error('Unable to delete order');
  }
};

const modifyOrder = async (orderId, updateOptions) => {
  try {
    const updatedOrder = await OrdersModel.findByIdAndUpdate(orderId, updateOptions, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) throw new Error('Order not found');
    return updatedOrder;
  } catch (error) {
    console.error(`Error editing order with ID ${orderId}:`, error);
    throw new Error('Unable to edit order');
  }
};

const fetchOrdersByIds = async (orderIds) => {
  try {
    return await OrdersModel.find({ _id: { $in: orderIds } });
  } catch (error) {
    console.error('Error fetching orders by IDs:', error);
    throw error;
  }
};

const fetchOrdersGroupedByEmail = async () => {
  try {
    const groupedOrders = await OrdersModel.aggregate([
      {
        $group: {
          _id: '$email',
          orders: { $push: '$$ROOT' }
        }
      }
    ]);
    return groupedOrders;
  } catch (error) {
    console.error('Error grouping orders by email:', error);
    throw new Error('Unable to group orders');
  }
};

const fetchOrdersInAscendingOrder = async () => {
  try {
    return await OrdersModel.find().sort({ createdAt: 1 });
  } catch (error) {
    console.error('Error retrieving orders in ascending order:', error);
    throw new Error('Unable to retrieve orders');
  }
};

export default {
  fetchOrders,
  fetchOrderById,
  addOrder,
  removeOrder,
  modifyOrder,
  fetchOrdersByIds,
  fetchOrdersGroupedByEmail,
  fetchOrdersInAscendingOrder
};
