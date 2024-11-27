const Cart = require('../../models/cart');
const Product = require('../../models/product');

/* ==================== Main Controller ==================== */

exports.updateQuantity = async (req, res) => {
  const { cartId, productId, variantId, newQuantity, selectedSize, selectedColor } = req.body;
  const userId = req.user.id;

  try {
    // Step 1: Parse and validate the new quantity
    const quantity = parseQuantity(newQuantity);
    if (quantity === null) {
      return res.status(400).json({ message: "Invalid quantity." });
    }

    // Step 2: Find the user's cart
    const cart = await findUserCart(cartId, userId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Step 3: Find the matching cart item
    const resolvedSizeId = await resolveSizeId(selectedSize);
    if (!resolvedSizeId) {
      return res.status(400).json({ message: "Invalid size selected." });
    }

    const itemIndex = findCartItemIndex(cart, productId, variantId, resolvedSizeId, selectedColor);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    // Step 4: Validate product, variant, and stock
    const { product, variant } = await validateProductAndVariant(productId, variantId);
    if (!product || !variant) {
      return res.status(404).json({ message: "Product or variant not found." });
    }

    const sizeStock = getSizeStock(variant, resolvedSizeId);
    if (!validateStockAvailability(quantity, sizeStock)) {
      return res.status(400).json({ message: `Not enough stock available. Available stock: ${sizeStock}` });
    }

    // Step 5: Update the cart item and cart totals
    updateCartItem(cart, itemIndex, quantity);
    updateCartTotal(cart);

    // Step 6: Save the cart and respond
    await cart.save();
    res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    console.error("Error updating quantity:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

/* ==================== Helper Functions ==================== */

// Find the user's cart
async function findUserCart(cartId, userId) {
  const query = isObjectId(cartId)
    ? { _id: cartId, userId }
    : { userId };
  return await Cart.findOne(query);
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

// Validate the product and its variant
async function validateProductAndVariant(productId, variantId) {
  const product = await Product.findOne({ _id: productId, "variants._id": variantId });
  const variant = product ? product.variants.id(variantId) : null;
  return { product, variant };
}

// Resolve size to ObjectId
async function resolveSizeId(size) {
  const Size = require('../../models/size'); // Import locally to avoid circular dependencies
  if (isObjectId(size)) return size;
  const sizeDoc = await Size.findOne({ sizeName: size.toLowerCase() });
  return sizeDoc ? sizeDoc._id : null;
}

// Check if value is a valid ObjectId
function isObjectId(value) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

// Get the stock for a specific size
function getSizeStock(variant, sizeId) {
  return variant.sizeStock?.get(sizeId.toString()) || 0;
}

// Validate if the stock is sufficient
function validateStockAvailability(requestedQuantity, stockAvailable) {
  return requestedQuantity <= stockAvailable;
}

// Update the quantity of a cart item
function updateCartItem(cart, itemIndex, newQuantity) {
  cart.items[itemIndex].quantity = newQuantity;
}

// Update the total price and weight of the cart
function updateCartTotal(cart) {
  const { totalPrice, totalWeight } = cart.items.reduce(
    (totals, item) => {
      const itemWeight = item.weight || 0; // Default to 0 if weight is undefined
      return {
        totalPrice: totals.totalPrice + item.newPrice * item.quantity,
        totalWeight: totals.totalWeight + itemWeight * item.quantity,
      };
    },
    { totalPrice: 0, totalWeight: 0 }
  );

  cart.totalPrice = totalPrice;
  cart.totalWeight = totalWeight;
  cart.updatedAt = Date.now();
}


// Parse and validate quantity
function parseQuantity(quantity) {
  const parsed = parseInt(quantity, 10);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
}