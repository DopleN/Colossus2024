import Cart from './cart.js';
import Search from './search.js';
import User from './user.js';
import QuickView from './quickView.js';

class Header {
  constructor() {
    this.cartInstance = new Cart();
    this.searchInstance = new Search();
    this.userInstance = new User();
    this.quickViewInstance = new QuickView();
  }

  get cart() {
    return this.cartInstance;
  }

  get search() {
    return this.searchInstance;
  }

  get user() {
    return this.userInstance;
  }

  get quickView() {
    return this.quickViewInstance;
  }
}

export default Header;
