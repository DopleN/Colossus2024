import TransactionService from '../../services/store/transaction_service.js';

export async function displayOrderList(req, res) {
  try {
    const orderRecords = await TransactionService.retrieveAllTransactions();
    res.render('../views/store/order_history', {
      orders: orderRecords,
    });
  } catch (error) {
    res.status(500).send('Error fetching orders');
  }
}
