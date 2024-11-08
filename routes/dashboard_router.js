import express from 'express';
import { verifyAdmin } from '../controllers/authHandler.js';

import { renderAdminLogin } from '../controllers/dashboardHandler.js';
import { showUsers } from '../controllers/dashboard/usersHandler.js';
import { showProducts } from '../controllers/dashboard/productsHandler.js';
import { showSuppliers } from '../controllers/dashboard/suppliersHandler.js';
import { showBrands } from '../controllers/dashboard/brandsHandler.js';
import { showOrders } from '../controllers/dashboard/ordersHandler.js';
import { showCategories } from '../controllers/dashboard/categoriesHandler.js';
import { showAnalytics } from '../controllers/dashboard/analyticsHandler.js';
import { showFacebook } from '../controllers/dashboard/facebookHandler.js';
import { showBranches } from '../controllers/dashboard/branchesHandler.js';

const router = express.Router();

router.route('/').get((req, res) => res.redirect('/admin/products'));

router.route('/login').get(renderAdminLogin);

router.route('/products').get(verifyAdmin, showProducts);

router.route('/suppliers').get(verifyAdmin, showSuppliers);

router.route('/categories').get(verifyAdmin, showCategories);

router.route('/users').get(verifyAdmin, showUsers);

router.route('/orders').get(verifyAdmin, showOrders);

router.route('/brands').get(verifyAdmin, showBrands);

router.route('/analytics').get(verifyAdmin, showAnalytics);

router.route('/facebook').get(verifyAdmin, showFacebook);

router.route('/branches').get(verifyAdmin, showBranches);

export default router;
s