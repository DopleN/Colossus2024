import { ProductsModel } from '../../models/dashboard/product.js';

const fetchProducts = async () => {
  try {
    return await ProductsModel.find();
  } catch (error) {
    console.error('Error retrieving products:', error);
    throw new Error('Unable to retrieve products');
  }
};

const fetchProductById = async (id) => {
  try {
    const product = await ProductsModel.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    console.error(`Error finding product with ID ${id}:`, error);
    throw new Error('Unable to retrieve product');
  }
};

const fetchProductByName = async (name) => {
  try {
    const product = await ProductsModel.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    console.error(`Error finding product with name ${name}:`, error);
    throw new Error('Unable to retrieve product');
  }
};

const addProduct = async (productData) => {
  try {
    const newProduct = new ProductsModel({
      name: productData.name,
      sizes: productData.sizes,
      price: productData.price,
      quantity: productData.quantity,
      description: productData.description,
      supplier: { name: productData.supplier.name, id: productData.supplier.id },
      image: productData.image,
      brand: { name: productData.brand.name, id: productData.brand.id },
      category: {
        name: productData.category.name,
        id: productData.category.id,
        subcategories: productData.category.subcategories,
      },
      gender: productData.gender,
    });
    return await newProduct.save();
  } catch (error) {
    console.error('Error saving product:', error);
    throw new Error('Unable to save product');
  }
};

const removeProduct = async (id) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(id);
    if (!deletedProduct) throw new Error('Product not found');
    return deletedProduct;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw new Error('Unable to delete product');
  }
};

const removeProductsBySupplierId = async (supplierId) => {
  try {
    return await ProductsModel.deleteMany({ 'supplier.id': supplierId });
  } catch (error) {
    console.error(`Error deleting products for supplier ID ${supplierId}:`, error);
    throw new Error('Unable to delete products by supplier ID');
  }
};

const removeProductsByBrandId = async (brandId) => {
  try {
    return await ProductsModel.deleteMany({ 'brand.id': brandId });
  } catch (error) {
    console.error(`Error deleting products for brand ID ${brandId}:`, error);
    throw new Error('Unable to delete products by brand ID');
  }
};

const removeProductsByCategoryId = async (categoryId) => {
  try {
    const products = await fetchProductsByCategoryId(categoryId);
    const productIds = products.map(product => product._id);
    return await ProductsModel.deleteMany({ _id: { $in: productIds } });
  } catch (error) {
    console.error(`Error deleting products for category ID ${categoryId}:`, error);
    throw new Error('Unable to delete products by category ID');
  }
};

const updateProduct = async (id, updateData) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) throw new Error('Product not found');
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw new Error('Unable to update product');
  }
};

const fetchProductsByCategoryId = async (id) => {
  try {
    return await ProductsModel.find({
      $or: [
        { 'category.id': id },
        { 'category.subcategories.id': id }
      ]
    });
  } catch (error) {
    console.error(`Error getting products for category ID ${id}:`, error);
    throw new Error('Unable to get products by category ID');
  }
};

const fetchProductsByGender = async (gender, limit = 6) => {
  try {
    const filter = gender ? { gender } : {};
    const products = await ProductsModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);
    return products.length ? products : null;
  } catch (error) {
    console.error('Error fetching products by gender:', error);
    throw new Error('Unable to fetch products by gender');
  }
};

const updateProductsBrandName = async (brandId, newName) => {
  try {
    await ProductsModel.updateMany(
      { 'brand.id': brandId },
      { $set: { 'brand.name': newName } }
    );
  } catch (error) {
    console.error('Error updating brand name for products:', error);
    throw new Error('Unable to update brand name for products');
  }
};

const updateProductsCategoryName = async (category) => {
  try {
    await ProductsModel.updateMany(
      { 'category.id': category.id, 'category.subcategories': { $size: 0 } },
      { $set: { 'category.name': category.name } }
    );

    for (const subcategory of category.subcategories) {
      await ProductsModel.updateMany(
        { 'category.id': category.id, 'category.subcategories.id': subcategory.id },
        {
          $set: {
            'category.name': category.name,
            'category.subcategories.$[elem].name': subcategory.name
          }
        },
        { arrayFilters: [{ 'elem.id': subcategory.id }] }
      );
    }
  } catch (error) {
    console.error('Error updating category name for products:', error);
    throw new Error('Unable to update category name for products');
  }
};

const fetchProductsByBrandName = async (brandName) => {
  try {
    const products = await ProductsModel.find({
      'brand.name': new RegExp(`^${brandName}$`, 'i')
    });
    return products.length ? products : null;
  } catch (error) {
    console.error(`Error finding products for brand name ${brandName}:`, error);
    throw new Error('Unable to retrieve products');
  }
};

export default {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategoryId,
  fetchProductByName,
  fetchProductsByBrandName,
  addProduct,
  removeProduct,
  removeProductsBySupplierId,
  removeProductsByBrandId,
  removeProductsByCategoryId,
  updateProduct,
  updateProductsBrandName,
  updateProductsCategoryName,
  fetchProductsByGender,
};
