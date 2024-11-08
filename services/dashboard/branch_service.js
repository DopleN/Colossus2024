import { LocationModel } from '../../models/dashboard/location.js';

const fetchLocations = async () => {
  try {
    return await LocationModel.find();
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Unable to fetch locations');
  }
};

const fetchLocationById = async (locationId) => {
  try {
    const location = await LocationModel.findById(locationId);
    if (!location) throw new Error('Location not found');
    return location;
  } catch (error) {
    console.error(`Error finding location with ID ${locationId}:`, error);
    throw new Error('Unable to fetch location');
  }
};

const addLocation = async (locationData) => {
  try {
    const newLocation = new LocationModel({
      name: locationData.name,
      address: locationData.location,
    });

    return await newLocation.save();
  } catch (error) {
    console.error('Error creating location:', error);
    throw new Error('Unable to create location');
  }
};

const removeLocation = async (locationId) => {
  try {
    const deletedLocation = await LocationModel.findByIdAndDelete(locationId);
    if (!deletedLocation) throw new Error('Location not found');
    return deletedLocation;
  } catch (error) {
    console.error(`Error deleting location with ID ${locationId}:`, error);
    throw new Error('Unable to delete location');
  }
};

const modifyLocation = async (locationId, updateData) => {
  try {
    const updatedLocation = await LocationModel.findByIdAndUpdate(locationId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedLocation) throw new Error('Location not found');
    return updatedLocation;
  } catch (error) {
    console.error(`Error updating location with ID ${locationId}:`, error);
    throw new Error('Unable to update location');
  }
};

const fetchLocationByName = async (locationName) => {
  try {
    const allLocations = await LocationModel.find();

    const foundLocation = allLocations.find(loc => loc.name.toLowerCase() === locationName.toLowerCase());
    if (!foundLocation) throw new Error('Location not found');
    return foundLocation;
  } catch (error) {
    console.error(`Error finding location with name ${locationName}:`, error);
    throw new Error('Unable to fetch location');
  }
};

export default {
  fetchLocations,
  fetchLocationById,
  addLocation,
  removeLocation,
  modifyLocation,
  fetchLocationByName,
};
