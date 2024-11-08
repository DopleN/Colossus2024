import express from 'express';
import { router as userProfileRouter } from './userProfileRouter.js';

import { displayHomePage } from '../../controllers/frontend/homeHandler.js';
import { userLogin, userRegister, requireLogin, redirectIfLoggedIn, userLogout } from '../../controllers/authHandler.js';
import { displayLoginPage } from '../../controllers/frontend/loginHandler.js';
import { displayRegisterPage } from '../../controllers/frontend/registerHandler.js';
import { displayShippingPage } from '../../controllers/frontend/shippingHandler.js';
import { displayTermsPage } from '../../controllers/frontend/termsHandler.js';
import { displayPrivacyPage } from '../../controllers/frontend/privacyHandler.js';
import { displayStoresPage } from '../../controllers/frontend/storesHandler.js';
import { displayLaunchesPage } from '../../controllers/frontend/launchesHandler.js';
import { displayGeneralPage } from '../../controllers/frontend/generalHandler.js';
import { displayFaqPage } from '../../controllers/frontend/faqHandler.js';
import { displayContactPage } from '../../controllers/frontend/contactHandler.js';
import { displayAccessibilityPage } from '../../controllers/frontend/accessibilityHandler.js';
import { displayAboutPage } from '../../controllers/frontend/aboutHandler.js';

import { displayCategoryPage, categoryMiddleware, displaySubCategoryPage, displayBrandPage } from '../../controllers/frontend/categoryHandler.js';
import { displayProductPage, productMiddleware } from '../../controllers/frontend/productHandler.js';
import { displayNotFoundPage } from '../../controllers/frontend/notFoundHandler.js';

import { displayCheckoutPage } from '../../controllers/frontend/checkoutHandler.js';
import { displayThankYouPage } from '../../controllers/frontend/thankYouHandler.js';

const router = express.Router();

router.route('/').get((req, res) => res.redirect('/homepage'));
router.route('/homepage').get(displayHomePage);

router.route('/login').get(redirectIfLoggedIn, displayLoginPage).post(userLogin);
router.route('/register').get(redirectIfLoggedIn, displayRegisterPage).post(userRegister);
router.route('/logout').get(requireLogin, userLogout);

router.route('/shipping').get(displayShippingPage);
router.route('/terms').get(displayTermsPage);
router.route('/privacy').get(displayPrivacyPage);
router.route('/stores').get(displayStoresPage);
router.route('/launches').get(displayLaunchesPage);
router.route('/general').get(displayGeneralPage);
router.route('/faq').get(displayFaqPage);
router.route('/contact').get(displayContactPage);
router.route('/accessibility').get(displayAccessibilityPage);
router.route('/about').get(displayAboutPage);

router.route('/category/id/:id').get(categoryMiddleware);
router.route('/category/:title').get(displayCategoryPage);
router.route('/category/:category/:subcategory').get(displaySubCategoryPage);
router.route('/brand/:title').get(displayBrandPage);

router.route('/product/id/:id').get(productMiddleware);
router.route('/product/:title').get(displayProductPage);

router.route('/checkout').get(displayCheckoutPage);
router.route('/thank-you').get(displayThankYouPage);

router.route('/not-found').get(displayNotFoundPage);

router.use(userProfileRouter);

export default router;
