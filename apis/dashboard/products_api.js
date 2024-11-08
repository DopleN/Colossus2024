import ProductService from '../../services/dashboard/product_service.js';

// Fetch all products
export async function listAllProducts(req, res) {
  try {
    const products = await ProductService.getProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Add a new product
export async function addNewProduct(req, res) {
  try {
    const productData = { ...req.body };
    const newProduct = await ProductService.createProduct(productData);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Update an existing product
export async function modifyProduct(req, res) {
  try {
    const productDetails = { ...req.body.product };
    const productId = req.body.prodId;

    const updatedProduct = await ProductService.updateProduct(productDetails, productId);
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Fetch a single product by ID
export async function fetchProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await ProductService.getProduct(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Remove a product by ID
export async function removeProduct(req, res) {
  const { id } = req.params;
  try {
    const deletedProduct = await ProductService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Fetch products by gender
export async function listProductsByGender(req, res) {
  const { gender } = req.params;
  try {
    const products = await ProductService.getProductsByGender(gender);
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: `No products found for gender: ${gender}.` });
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error retrieving products by gender:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
