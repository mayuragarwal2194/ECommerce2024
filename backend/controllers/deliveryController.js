const DeliveryInfo = require('../models/delivery');
const { Country, State, City } = require('country-state-city');
const User = require('../models/user');

// Save delivery information
exports.saveDeliveryInfo = async (req, res) => {
  const { fullName, mobileNumber, addressLine1, addressLine2, landmark, pinCode, townCity, state, country } = req.body;

  try {
    // Create a new DeliveryInfo document
    const newDeliveryInfo = new DeliveryInfo({
      user: req.user.id,
      fullName,
      mobileNumber,
      addressLine1,
      addressLine2,
      landmark,
      pinCode,
      townCity,
      state,
      country,
    });

    const savedDeliveryInfo = await newDeliveryInfo.save();

    // Check if this is the user's first address
    const user = await User.findById(req.user.id);

    if (user.deliveryInfo.length === 0) {
      // First address: set as default
      user.defaultAddress = savedDeliveryInfo._id;
    }

    // Push the new address to the user's deliveryInfo array
    user.deliveryInfo.push(savedDeliveryInfo._id);
    await user.save();

    res.status(201).json({ message: 'Delivery information saved successfully!' });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to save delivery information' });
  }
};

// Controller function for editing delivery information
exports.editDeliveryInfo = async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const userId = req.user.id; // `authMiddleware` sets `req.user`
    const addressId = req.params.addressId;
    const {
      fullName,
      mobileNumber,
      addressLine1,
      addressLine2,
      landmark,
      pinCode,
      townCity,
      state,
      country,
    } = req.body;

    console.log('Received data:', req.body); // Log the incoming data

    // Validate required fields
    if (!addressId || !userId) {
      return res.status(400).json({ message: 'Address ID and user ID are required' });
    }

    // Find the delivery info by ID and ensure it belongs to the logged-in user
    const deliveryInfo = await DeliveryInfo.findOne({ _id: addressId, user: userId });
    if (!deliveryInfo) {
      return res.status(404).json({ message: 'Delivery info not found or not authorized' });
    }

    // Update the fields if they exist in req.body
    if (fullName) deliveryInfo.fullName = fullName;
    if (mobileNumber) deliveryInfo.mobileNumber = mobileNumber;
    if (addressLine1) deliveryInfo.addressLine1 = addressLine1;
    if (addressLine2) deliveryInfo.addressLine2 = addressLine2;
    if (landmark) deliveryInfo.landmark = landmark;
    if (pinCode) deliveryInfo.pinCode = pinCode;
    if (townCity) deliveryInfo.townCity = townCity;
    if (state) deliveryInfo.state = state;
    if (country) deliveryInfo.country = country;

    // Save the updated delivery info
    await deliveryInfo.save();

    res.status(200).json({ message: 'Delivery information updated successfully', deliveryInfo });
  } catch (error) {
    console.error('Error updating delivery information:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// Set Default Address
exports.setDefaultAddress = async (req, res) => {
  const { addressId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Check if the provided address exists in the user's deliveryInfo array
    if (user.deliveryInfo.includes(addressId)) {
      user.defaultAddress = addressId;
      await user.save();

      res.status(200).json({ message: 'Default address updated successfully!' });
    } else {
      res.status(404).json({ error: 'Address not found in user\'s saved addresses' });
    }
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'Failed to update default address' });
  }
};

// Get Delivery Info
exports.getDeliveryInfo = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from the token
    console.log(userId);

    // Find the user by ID and populate the deliveryInfo
    const user = await User.findById(userId).populate('deliveryInfo');

    if (!user || !user.deliveryInfo) {
      return res.status(404).json({ message: 'Delivery information not found' });
    }

    res.json(user.deliveryInfo); // Send only the delivery info in response
  } catch (error) {
    console.error('Error fetching delivery information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an address for a user
exports.deleteAddress = async (req, res) => {
  const { addressId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Check if the address exists in the user's deliveryInfo array
    if (!user.deliveryInfo.includes(addressId)) {
      return res.status(404).json({ error: 'Address not found in user\'s saved addresses' });
    }

    // Remove the address from the user's deliveryInfo array
    user.deliveryInfo = user.deliveryInfo.filter(id => id.toString() !== addressId);

    // If the address is the default address, clear the default or assign a new one
    if (user.defaultAddress && user.defaultAddress.toString() === addressId) {
      user.defaultAddress = user.deliveryInfo.length > 0 ? user.deliveryInfo[0] : null;
    }

    await user.save();

    // Delete the address document itself
    await DeliveryInfo.findByIdAndDelete(addressId);

    res.status(200).json({ message: 'Address deleted successfully!' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};


// Fetch all countries
exports.getCountries = (req, res) => {
  try {
    const countries = Country.getAllCountries();
    const formattedCountries = countries.map(country => ({
      name: country.name,
      code: country.isoCode,
    }));
    res.status(200).json(formattedCountries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

// Fetch states based on selected country
exports.getStatesByCountry = (req, res) => {
  const { countryCode } = req.params;
  try {
    const states = State.getStatesOfCountry(countryCode);
    const formattedStates = states.map(state => ({
      name: state.name,
      code: state.isoCode,
    }));
    res.status(200).json(formattedStates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch states' });
  }
};

// Fetch cities based on selected state
exports.getCitiesByState = (req, res) => {
  const { countryCode, stateCode } = req.params; // Extract countryCode and stateCode
  try {
    const cities = City.getCitiesOfState(countryCode, stateCode);
    const formattedCities = cities.map(city => city.name);
    res.status(200).json(formattedCities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};
