import express from 'express';
import { showProfile } from '../../controllers/frontend/user/profileHandler.js';
import { showOrders } from '../../controllers/frontend/user/ordersHandler.js';
import { showSettings } from '../../controllers/frontend/user/settingsHandler.js';
import { ensureAuthenticated, modifyUser } from '../../controllers/authHandler.js';

const router = express.Router();

router.route('/user/profile').get(ensureAuthenticated, showProfile);

router.route('/user/profile/orders').get(ensureAuthenticated, showOrders);
router.route('/user/profile/settings').get(ensureAuthenticated, showSettings).post(ensureAuthenticated, modifyUser);

export { router };
s