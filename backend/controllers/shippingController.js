const ShippingRule = require('../models/shippingRule');
const Cart = require('../models/cart');

// Controller to add a new shipping rule dynamically
exports.addShippingRule = async (req, res) => {
  try {
    const { weightRange, distanceRange, charges } = req.body;

    if (!weightRange || !distanceRange || !charges) {
      return res.status(400).json({ message: 'Weight range, distance range, and charges are required.' });
    }

    const newRule = new ShippingRule({
      weightRange,
      distanceRange,
      charges,
    });

    await newRule.save();

    res.status(201).json({
      message: 'Shipping rule added successfully.',
      rule: newRule,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        message: 'A shipping rule with the same weight and distance range already exists.',
      });
    }

    console.error('Error adding shipping rule:', error);
    res.status(500).json({ message: 'Failed to add shipping rule.', error: error.message });
  }
};

// Controller to update an existing shipping rule
exports.updateShippingRule = async (req, res) => {
  try {
    const { id } = req.params; // Get the rule ID from URL params
    const { weightRange, distanceRange, charges } = req.body;

    // Check if the request body is empty
    if (!weightRange && !distanceRange && charges == null) {
      return res.status(400).json({
        message: 'At least one field (weightRange, distanceRange, or charges) must be provided to update.',
      });
    }

    // Fetch the existing rule
    const existingRule = await ShippingRule.findById(id);

    if (!existingRule) {
      return res.status(404).json({ message: 'Shipping rule not found.' });
    }

    // Merge existing weightRange and distanceRange with the new values
    const updatedData = {
      ...(weightRange && {
        weightRange: {
          min: weightRange.min ?? existingRule.weightRange.min,
          max: weightRange.max ?? existingRule.weightRange.max,
        },
      }),
      ...(distanceRange && {
        distanceRange: {
          min: distanceRange.min ?? existingRule.distanceRange.min,
          max: distanceRange.max ?? existingRule.distanceRange.max,
        },
      }),
      ...(charges != null && { charges }),
    };

    // Update the rule
    const updatedRule = await ShippingRule.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true, // Ensure validation is applied
    });

    res.status(200).json({
      message: 'Shipping rule updated successfully.',
      rule: updatedRule,
    });
  } catch (error) {
    console.error('Error updating shipping rule:', error);
    res.status(500).json({ message: 'Failed to update shipping rule.', error: error.message });
  }
};

// Controller to delete an existing shipping rule
exports.deleteShippingRule = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Find and delete the shipping rule by ID
    const deletedRule = await ShippingRule.findByIdAndDelete(id);

    if (!deletedRule) {
      return res.status(404).json({ message: 'Shipping rule not found.' });
    }

    res.status(200).json({
      message: 'Shipping rule deleted successfully.',
      rule: deletedRule,
    });
  } catch (error) {
    console.error('Error deleting shipping rule:', error);
    res.status(500).json({ message: 'Failed to delete shipping rule.', error: error.message });
  }
};

exports.calculateShippingCharges = async (req, res) => {
  try {
    console.log('User from token:', req.user);

    // Extract userId from the decoded token (from the auth middleware)
    const userId = req.user.id;

    const { distance } = req.body;

    if (!distance || distance <= 0) {
      console.error('Invalid distance provided:', distance);
      return res.status(400).json({ message: 'Invalid distance provided.' });
    }

    console.log('Fetching cart for userId:', userId);

    // Step 1: Fetch the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      console.error('Cart is empty or not found for userId:', userId);
      return res.status(404).json({ message: 'Cart is empty or not found.' });
    }

    console.log('Cart found. Total weight of cart:', cart.totalWeight);

    if (!cart.totalWeight || cart.totalWeight <= 0) {
      console.error('Total weight of the cart is zero or invalid.');
      return res.status(400).json({ message: 'Total weight of the cart is zero or invalid.' });
    }

    console.log('Finding shipping rule for totalWeight:', cart.totalWeight, 'and distance:', distance);

    // Step 2: Find the applicable shipping rule
    const shippingRule = await ShippingRule.findOne({
      'weightRange.min': { $lte: cart.totalWeight },
      'weightRange.max': { $gte: cart.totalWeight },
      'distanceRange.min': { $lte: distance },
      'distanceRange.max': { $gte: distance },
    });

    if (!shippingRule) {
      console.error('No shipping rule found for weight:', cart.totalWeight, 'and distance:', distance);
      return res.status(404).json({ message: 'No shipping rule found for the given weight and distance.' });
    }

    console.log('Found shipping rule:', shippingRule);

    // Step 3: Return the calculated shipping charges
    const shippingCharges = shippingRule.charges;

    res.status(200).json({
      message: 'Shipping charges calculated successfully.',
      shippingCharges,
      totalWeight: cart.totalWeight,
    });
  } catch (error) {
    console.error('Error calculating shipping charges:', error);
    res.status(500).json({ message: 'Failed to calculate shipping charges.', error: error.message });
  }
};




