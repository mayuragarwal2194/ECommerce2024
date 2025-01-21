const Coupon = require('../models/coupon');
const Cart = require('../models/cart');

// Controller to add a new coupon
exports.addCoupon = async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minimumOrderValue,
    maximumDiscountValue,
    expiresAt,
    isActive,
  } = req.body;

  try {
    // Check if a coupon with the same code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'A coupon with this code already exists.',
      });
    }

    // Create a new coupon
    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minimumOrderValue,
      maximumDiscountValue,
      expiresAt,
      isActive,
    });

    await newCoupon.save();

    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully.',
      data: newCoupon,
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the coupon.',
    });
  }
};

// Get all active coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true }); // Get only active coupons

    if (coupons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active coupons found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupons retrieved successfully.',
      data: coupons,
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving coupons.',
    });
  }
};


// Controller to delete a coupon
exports.deleteCoupon = async (req, res) => {
  const { id } = req.params;  // You can also use 'code' if you prefer, e.g. req.params.code

  try {
    // Find and delete the coupon by its id
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the coupon.',
    });
  }
};

// Controller to edit/update a coupon
exports.editCoupon = async (req, res) => {
  const { id } = req.params;  // You can also use 'code' if you prefer
  const { code, discountType, discountValue, minimumOrderValue, maximumDiscountValue, expiresAt, isActive } = req.body;

  try {
    // Find the coupon by its ID
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found.',
      });
    }

    // Update the coupon fields
    coupon.code = code || coupon.code;  // If not provided, retain the old value
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue || coupon.discountValue;
    coupon.minimumOrderValue = minimumOrderValue || coupon.minimumOrderValue;
    coupon.maximumDiscountValue = maximumDiscountValue || coupon.maximumDiscountValue;
    coupon.expiresAt = expiresAt ? new Date(expiresAt) : coupon.expiresAt; // Parse date if exists
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

    // Save the updated coupon
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: 'Coupon updated successfully.',
      data: coupon,
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the coupon.',
    });
  }
};

// Helper function for Coupon Validation
const validateCoupon = async (code, orderTotal) => {
  const coupon = await Coupon.findOne({ code: code.trim() });

  if (!coupon) {
    return { isValid: false, message: 'Invalid coupon code.' };
  }

  if (!coupon.isActive) {
    return { isValid: false, message: 'This coupon is no longer active.' };
  }

  if (new Date() > coupon.expiresAt) {
    return { isValid: false, message: 'This coupon has expired.' };
  }

  if (orderTotal < coupon.minimumOrderValue) {
    return {
      isValid: false,
      message: `Minimum order value of ${coupon.minimumOrderValue} is required to use this coupon.`,
    };
  }

  return { isValid: true, coupon };
};

exports.verifyCoupon = async (req, res) => {
  const { code, orderTotal } = req.body;

  try {
    const { isValid, message, coupon } = await validateCoupon(code, orderTotal);

    if (!isValid) {
      return res.status(400).json({ success: false, message });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon is valid.',
      data: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
    });
  } catch (error) {
    console.error('Error verifying coupon:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while verifying the coupon.',
    });
  }
};

exports.applyDiscount = async (req, res) => {
  const { code } = req.body; // Only the coupon code is required
  const userId = req.user.id; // Extract user ID from the token (auth middleware sets `req.user`)

  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const orderTotal = cart.totalPrice; // Use the original total price for calculations

    // Validate the coupon
    const { isValid, message, coupon } = await validateCoupon(code, orderTotal);

    if (!isValid) {
      return res.status(400).json({ success: false, message });
    }

    // Calculate the discount
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maximumDiscountValue) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscountValue);
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed the order total
    discountAmount = Math.min(discountAmount, orderTotal);

    // Round the discount amount to 2 decimal places
    discountAmount = parseFloat(discountAmount.toFixed(2));

    const finalTotal = parseFloat((orderTotal - discountAmount).toFixed(2));

    // Update the cart with coupon and final total
    cart.coupon = {
      code: coupon.code,
      discountAmount,
    };
    cart.finalTotal = finalTotal; // Update the final total in the cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Discount applied successfully.',
      data: {
        discountAmount,
        finalTotal,
        code: coupon.code,
      },
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while applying the discount.',
    });
  }
};

exports.removeCoupon = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the token (auth middleware sets `req.user`)

  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    // Check if a coupon is applied
    if (!cart.coupon || !cart.coupon.code) {
      return res.status(400).json({
        success: false,
        message: 'No coupon applied to remove.',
      });
    }

    // Remove the coupon and reset the final total to the original total price
    cart.coupon = null; // Clear the coupon field
    cart.finalTotal = cart.totalPrice; // Reset the final total
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Coupon removed successfully.',
      data: {
        finalTotal: cart.totalPrice, // Return the reset total price
      },
    });
  } catch (error) {
    console.error('Error removing coupon:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while removing the coupon.',
    });
  }
};
