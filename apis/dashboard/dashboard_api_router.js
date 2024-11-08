import express from 'express';
import {
  listProducts,
  fetchProduct,
  addProduct,
  removeProduct,
  listProductsByGender,
  modifyProduct
} from './inventory/products_handler.js';

import {
  addSupplier,
  removeSupplier,
  fetchSupplier,
  fetchSupplierBrands,
  listSuppliers,
} from './inventory/suppliers_handler.js';

import {
  addBrand,
  modifyBrand,
  removeBrand,
  fetchBrand,
  listBrands,
  listProductsByBrand
} from './inventory/brands_handler.js';

import {
  placeOrder,
  reviseOrder,
  removeOrder,
  fetchOrder,
  listOrders,
  groupOrdersByEmail,
  listOrdersAscending
} from './inventory/orders_handler.js';

import {
  addCategory,
  modifyCategory,
  removeCategory,
  listCategories,
  fetchCategory,
  listProductsByCategory
} from './inventory/categories_handler.js';

import {
  fetchUser,
  listUsers,
  removeUser,
  reviseUser,
  reviseUserRole
} from './accounts/users_handler.js';

import {
  addBranch,
  modifyBranch,
  removeBranch,
  fetchBranch,
  listBranches,
  fetchBranchByName
} from './locations/branches_handler.js';

import { adminCheck } from '../../middleware/authorization_check.js';

const router = express.Router();

router.route('/inventory/products').get(listProducts).post(adminCheck, addProduct);
router.route('/inventory/products/:id').get(fetchProduct).delete(adminCheck, removeProduct).put(adminCheck, modifyProduct);
router.route('/inventory/products/gender/:gender').get(listProductsByGender);

router.route('/inventory/suppliers').get(listSuppliers).post(adminCheck, addSupplier);
router.route('/inventory/suppliers/:id').get(fetchSupplier).delete(adminCheck, removeSupplier);
router.route('/inventory/suppliers/:id/brands').get(fetchSupplierBrands);

router.route('/inventory/brands').get(listBrands).post(adminCheck, addBrand);
router.route('/inventory/brands/:id').get(fetchBrand).put(adminCheck, modifyBrand).delete(adminCheck, removeBrand);
router.route('/inventory/brands/products/:name').get(listProductsByBrand);

router.route('/locations/branches').get(listBranches).post(adminCheck, addBranch);
router.route('/locations/branches/:id').get(fetchBranch).put(adminCheck, modifyBranch).delete(adminCheck, removeBranch);
router.route('/locations/branches/name/:name').get(fetchBranchByName);

router.route('/inventory/categories').get(listCategories).post(adminCheck, addCategory);
router.route('/inventory/categories/:id').get(fetchCategory).delete(adminCheck, removeCategory).put(adminCheck, modifyCategory);
router.route('/inventory/categories/products/:id').get(listProductsByCategory);

router.route('/orders').get(listOrders).post(placeOrder);
router.route('/orders/groupby').get(groupOrdersByEmail);
router.route('/orders/asc').get(listOrdersAscending);
router.route('/orders/:id').get(fetchOrder).put(adminCheck, reviseOrder).delete(adminCheck, removeOrder);

router.route('/accounts/users').get(listUsers);
router.route('/accounts/users/:email').get(fetchUser).delete(adminCheck, removeUser).put(adminCheck, reviseUser);
router.route('/accounts/users/:email/role').put(adminCheck, reviseUserRole);

router.route('/auth/token').get(adminCheck, (req, res) => {
  return res.json({ token: process.env.FACEBOOK_API_KEY });
});

export default router;
