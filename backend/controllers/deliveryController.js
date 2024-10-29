const DeliveryInfo = require('../models/delivery');
const { Country, State, City } = require('country-state-city');
const User = require('../models/user');

// Save delivery information
exports.saveDeliveryInfo = async (req, res) => {
  const { fullName, mobileNumber, addressLine1, addressLine2, landmark, pinCode, townCity, state, country } = req.body;

  try {
    // Check if delivery information already exists for the user
    let deliveryInfo = await DeliveryInfo.findOne({ user: req.user.id });

    if (deliveryInfo) {
      // If it exists, update the existing information
      deliveryInfo.fullName = fullName;
      deliveryInfo.mobileNumber = mobileNumber;
      deliveryInfo.addressLine1 = addressLine1;
      deliveryInfo.addressLine2 = addressLine2;
      deliveryInfo.landmark = landmark;
      deliveryInfo.pinCode = pinCode;
      deliveryInfo.townCity = townCity;
      deliveryInfo.state = state;
      deliveryInfo.country = country;

      await deliveryInfo.save();
      res.status(200).json({ message: 'Delivery information updated successfully!' });
    } else {
      // If it doesn't exist, create a new entry
      deliveryInfo = new DeliveryInfo({
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

      const savedDeliveryInfo = await deliveryInfo.save();

      // Update the user's deliveryInfo field with the new delivery info ID
      await User.findByIdAndUpdate(req.user.id, { deliveryInfo: savedDeliveryInfo._id });

      res.status(201).json({ message: 'Delivery information saved successfully!' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to save or update delivery information' });
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
