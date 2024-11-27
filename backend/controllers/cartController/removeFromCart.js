const Cart = require('../../models/cart');
const mongoose = require('mongoose');

/* ==================== Main Controller ==================== */

exports.removeFromCart = async (req, res) => {
  const { productId, variantId, selectedSize, selectedColor } = req.body;
  const userId = req.user.id;

  try {
    // Step 1: Validate input
    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return res.status(400).json({ message: 'Invalid product or variant ID.' });
    }

    const resolvedSizeId = await resolveSizeId(selectedSize);
    if (!resolvedSizeId) {
      return res.status(400).json({ message: 'Invalid size provided.' });
    }

    // Step 2: Retrieve the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Step 3: Find and remove the item
    const itemIndex = findCartItemIndex(cart, productId, variantId, resolvedSizeId, selectedColor);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    cart.items.splice(itemIndex, 1); // Remove the item

    // Step 4: Update total price and weight, then save the cart
    updateCartSummary(cart);
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart.', cart });
  } catch (error) {
    console.error('Error removing from cart:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

/* ==================== Helper Functions ==================== */

// Validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Resolve size to ObjectId
async function resolveSizeId(size) {
  const Size = require('../../models/size'); // Import locally to avoid circular dependencies
  if (isValidObjectId(size)) return size;
  const sizeDoc = await Size.findOne({ sizeName: size.toLowerCase() });
  return sizeDoc ? sizeDoc._id : null;
}

// Find the index of the cart item matching the given criteria
function findCartItemIndex(cart, productId, variantId, sizeId, color) {
  return cart.items.findIndex((item) =>
    item.productId.equals(productId) &&
    item.variantId.equals(variantId) &&
    item.size.toString() === sizeId.toString() &&
    item.color === color
  );
}

// Update the cart's total price and weight
function updateCartSummary(cart) {
  cart.totalPrice = cart.items.reduce((total, item) => total + item.newPrice * item.quantity, 0);
  cart.totalWeight = cart.items.reduce((total, item) => {
    const weight = item.weight || 0; // Ensure weight is defined
    return total + weight * item.quantity;
  }, 0);
  cart.updatedAt = new Date();
}