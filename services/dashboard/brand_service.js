import { LabelModel } from '../../models/dashboard/label.js';

const fetchLabels = async () => {
  try {
    return await LabelModel.find();
  } catch (error) {
    console.error('Error fetching labels:', error);
    throw new Error('Unable to fetch labels');
  }
};

const fetchLabelById = async (labelId) => {
  try {
    const label = await LabelModel.findById(labelId);
    if (!label) throw new Error('Label not found');
    return label;
  } catch (error) {
    console.error(`Error finding label with ID ${labelId}:`, error);
    throw new Error('Unable to fetch label');
  }
};

const addLabel = async (labelData) => {
  try {
    const newLabel = new LabelModel({
      name: labelData.name,
    });

    return await newLabel.save();
  } catch (error) {
    console.error('Error creating label:', error);
    throw new Error('Unable to create label');
  }
};

const removeLabel = async (labelId) => {
  try {
    const deletedLabel = await LabelModel.findByIdAndDelete(labelId);
    if (!deletedLabel) throw new Error('Label not found');
    return deletedLabel;
  } catch (error) {
    console.error(`Error deleting label with ID ${labelId}:`, error);
    throw new Error('Unable to delete label');
  }
};

const modifyLabel = async (labelId, updateData) => {
  try {
    const updatedLabel = await LabelModel.findByIdAndUpdate(labelId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedLabel) throw new Error('Label not found');
    return updatedLabel;
  } catch (error) {
    console.error(`Error updating label with ID ${labelId}:`, error);
    throw new Error('Unable to update label');
  }
};

const fetchLabelByName = async (labelName) => {
  try {
    const allLabels = await LabelModel.find();

    const foundLabel = allLabels.find(lbl => lbl.name.toLowerCase() === labelName.toLowerCase());
    if (!foundLabel) throw new Error('Label not found');
    return foundLabel;
  } catch (error) {
    console.error(`Error finding label with name ${labelName}:`, error);
    throw new Error('Unable to fetch label');
  }
};

export default {
  fetchLabels,
  fetchLabelById,
  addLabel,
  removeLabel,
  modifyLabel,
  fetchLabelByName,
};
