import { ItemModel } from '../../models/dashboard/item.js';

const fetchItems = async () => {
  try {
    return await ItemModel.find();
  } catch (error) {
    console.error('Error fetching items:', error);
    throw new Error('Unable to fetch items');
  }
};

const fetchItemById = async (itemId) => {
  try {
    const item = await ItemModel.findById(itemId);
    if (item) return item;

    const allItems = await fetchItems();
    const nestedItems = allItems.flatMap(item => item.subItems);

    const foundItem = nestedItems.find(subItem => subItem._id == itemId);
    if (!foundItem) throw new Error('Item not found');
    
    return foundItem;
  } catch (error) {
    console.error(`Error finding item with ID ${itemId}:`, error);
    throw new Error('Unable to fetch item');
  }
};

const addItem = async (itemData) => {
  try {
    const newItem = new ItemModel({
      name: itemData.name,
      subItems: itemData.subItems,
    });

    return await newItem.save();
  } catch (error) {
    console.error('Error creating item:', error);
    throw new Error('Unable to create item');
  }
};

const modifyItem = async (itemId, itemData) => {
  try {
    const updatedItem = await ItemModel.findByIdAndUpdate(
      itemId,
      {
        name: itemData.name,
        subItems: itemData.subItems,
      },
      { new: true }
    );

    if (!updatedItem) {
      throw new Error('Item not found');
    }

    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
    throw new Error('Unable to update item');
  }
};

const fetchItemByName = async (itemName) => {
  try {
    const allItems = await fetchItems();

    const mainItem = allItems.find(item => item.name.toLowerCase() === itemName.toLowerCase());
    const allSubItems = allItems.flatMap(item => item.subItems);
    const foundSubItem = allSubItems.find(subItem => subItem.name.toLowerCase() === itemName.toLowerCase());

    const resultItem = mainItem || foundSubItem;

    if (!resultItem) throw new Error('Item not found');
    return resultItem;
  } catch (error) {
    console.error(`Error finding item with name ${itemName}:`, error);
    throw new Error('Unable to fetch item');
  }
};

const removeItem = async (itemId) => {
  try {
    const deletedItem = await ItemModel.findByIdAndDelete(itemId);
    if (!deletedItem) throw new Error('Item not found');
    return deletedItem;
  } catch (error) {
    console.error(`Error deleting item with ID ${itemId}:`, error);
    throw new Error('Unable to delete item');
  }
};

const updateItem = async (itemId, updateOptions) => {
  try {
    const updatedItem = await ItemModel.findByIdAndUpdate(
      itemId,
      updateOptions,
      { new: true, runValidators: true }
    );
    if (!updatedItem) throw new Error('Item not found');
    return updatedItem;
  } catch (error) {
    console.error(`Error editing item with ID ${itemId}:`, error);
    throw new Error('Unable to edit item');
  }
};

export default {
  fetchItems,
  fetchItemById,
  fetchItemByName,
  addItem,
  modifyItem,
  removeItem,
  updateItem,
};
