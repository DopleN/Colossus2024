import ItemService from '../../services/store/item_service.js';
import VendorService from '../../services/store/vendor_service.js';
import GroupService from '../../services/store/group_service.js';

export async function displayProductList(req, res) {
  try {
    const products = await ItemService.fetchAllItems();
    const vendors = await VendorService.fetchAllVendors();
    const groups = await GroupService.fetchAllGroups();

    res.render('../views/store/product_catalog', {
      items: products,
      vendors: vendors,
      groups: groups,
    });
  } catch (error) {
    res.status(500).send('Error loading product data');
  }
}
