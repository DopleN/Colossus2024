import { VendorModel } from '../../models/dashboard/vendor.js';

const fetchVendors = async () => {
  try {
    return await VendorModel.find();
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw new Error('Unable to fetch vendors');
  }
};

const fetchVendorById = async (vendorId) => {
  try {
    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) throw new Error('Vendor not found');
    return vendor;
  } catch (error) {
    console.error(`Error finding vendor with ID ${vendorId}:`, error);
    throw new Error('Unable to fetch vendor');
  }
};

const addVendor = async (vendorData) => {
  try {
    const newVendor = new VendorModel({
      name: vendorData.name,
      location: vendorData.location,
      brands: vendorData.brands,
    });
    return await newVendor.save();
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw new Error('Unable to create vendor');
  }
};

const removeVendor = async (vendorId) => {
  try {
    const deletedVendor = await VendorModel.findByIdAndDelete(vendorId);
    if (!deletedVendor) throw new Error('Vendor not found');
    return deletedVendor;
  } catch (error) {
    console.error(`Error deleting vendor with ID ${vendorId}:`, error);
    throw new Error('Unable to delete vendor');
  }
};

const modifyVendor = async (vendorId, updateData) => {
  try {
    const updatedVendor = await VendorModel.findByIdAndUpdate(
      vendorId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedVendor) throw new Error('Vendor not found');
    return updatedVendor;
  } catch (error) {
    console.error(`Error updating vendor with ID ${vendorId}:`, error);
    throw new Error('Unable to update vendor');
  }
};

const fetchVendorBrands = async (vendorId) => {
  try {
    const vendor = await fetchVendorById(vendorId);
    return vendor.brands;
  } catch (error) {
    console.error(`Error fetching brands for vendor ID ${vendorId}:`, error);
    throw new Error('Unable to fetch vendor brands');
  }
};

const removeBrandFromVendors = async (brandId) => {
  try {
    await VendorModel.updateMany(
      { 'brands.id': brandId },
      { $pull: { brands: { id: brandId } } }
    );
  } catch (error) {
    console.error('Error removing brand from vendors with ID:', brandId);
    throw new Error('Unable to remove brand from vendors');
  }
};

const renameVendorBrand = async (brandId, newBrandName) => {
  try {
    await VendorModel.updateMany(
      { 'brands.id': brandId },
      { $set: { 'brands.$[elem].name': newBrandName } },
      { arrayFilters: [{ 'elem.id': brandId }] }
    );
  } catch (error) {
    console.error('Error updating brand name for ID:', brandId);
    throw new Error('Unable to update brand name for vendors');
  }
};

export default {
  fetchVendors,
  fetchVendorById,
  addVendor,
  removeVendor,
  modifyVendor,
  fetchVendorBrands,
  removeBrandFromVendors,
  renameVendorBrand,
};
