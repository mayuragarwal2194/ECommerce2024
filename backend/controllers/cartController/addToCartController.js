const Cart = require('../../models/cart');
const User = require('../../models/user');
const Product = require('../../models/product');


// Main addToCart function
exports.addToCart = async (req, res) => {
  console.log('Request body:', req.body);
  const { productId, variantId, quantity, selectedSize, selectedColor } = req.body;
  const userId = req.user.id;

  try {
    // Validate product and variant
    const product = await validateProduct(productId, variantId);
    if (!product) {
      return res.status(404).json({ message: "Product or variant not found." });
    }

    // Validate color and size
    const variant = product.variants.id(variantId);
    if (!validateColor(variant, selectedColor) || !validateSize(variant, selectedSize)) {
      return res.status(400).json({ message: "Selected color or size is not available for this variant." });
    }

    // Check stock for selected size
    const sizeStock = getSizeStock(variant, selectedSize);
    if (sizeStock === undefined) {
      return res.status(400).json({ message: "Selected size does not have a stock entry." });
    }

    // Validate and parse quantity
    const requestedQuantity = parseQuantity(quantity);
    if (requestedQuantity === null) {
      return res.status(400).json({ message: "Invalid quantity." });
    }

    // Retrieve or create the cart
    let cart = await findOrCreateCart(userId);

    // Calculate total requested quantity and validate stock
    const existingItemIndex = findExistingItemIndex(cart, productId, variantId, selectedSize, selectedColor);
    const totalRequestedQuantity = calculateTotalRequestedQuantity(cart, existingItemIndex, requestedQuantity);
    if (totalRequestedQuantity > sizeStock) {
      return res.status(400).json({ message: `Not enough stock available for the selected size. Available stock: ${sizeStock}` });
    }

    // Update cart items
    updateCartItems(cart, existingItemIndex, productId, variantId, requestedQuantity, totalRequestedQuantity, variant, selectedSize, selectedColor);

    // Calculate the total price and update the timestamp
    updateCartTotal(cart);

    await cart.save();

    res.status(201).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to validate the product and variant
async function validateProduct(productId, variantId) {
  return Product.findOne({ _id: productId, "variants._id": variantId });
}

// Helper function to validate the color
function validateColor(variant, selectedColor) {
  return variant.attributes.color === selectedColor;
}

// Helper function to validate the size
function validateSize(variant, selectedSize) {
  return variant.attributes.size.some(size => size.toString() === selectedSize);
}

// Helper function to get the stock for a specific size
function getSizeStock(variant, selectedSize) {
  return variant.sizeStock.get(selectedSize.toString());
}

// Helper function to parse and validate quantity
function parseQuantity(quantity) {
  const parsedQuantity = parseInt(quantity, 10);
  return isNaN(parsedQuantity) || parsedQuantity <= 0 ? null : parsedQuantity;
}

// Helper function to find or create a cart for a user
async function findOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await User.findByIdAndUpdate(userId, { cart: cart._id }, { new: true });
  }
  return cart;
}

// Helper function to find if the item already exists in the cart
function findExistingItemIndex(cart, productId, variantId, selectedSize, selectedColor) {
  return cart.items.findIndex(item =>
    item.productId.equals(productId) &&
    item.variantId.equals(variantId) &&
    item.size === selectedSize &&
    item.color === selectedColor
  );
}

// Helper function to calculate the total requested quantity
function calculateTotalRequestedQuantity(cart, existingItemIndex, requestedQuantity) {
  return existingItemIndex > -1 ? cart.items[existingItemIndex].quantity + requestedQuantity : requestedQuantity;
}

// Helper function to update cart items
function updateCartItems(cart, existingItemIndex, productId, variantId, requestedQuantity, totalRequestedQuantity, variant, selectedSize, selectedColor) {
  if (existingItemIndex > -1) {
    // If item exists, update quantity
    cart.items[existingItemIndex].quantity = totalRequestedQuantity;
  } else {
    // Add new item to the cart
    cart.items.push({
      productId,
      variantId,
      quantity: requestedQuantity,
      newPrice: variant.newPrice,
      oldPrice: variant.oldPrice,
      size: selectedSize,
      color: selectedColor
    });
  }
}

// Helper function to update the total price of the cart
function updateCartTotal(cart) {
  cart.totalPrice = cart.items.reduce((total, item) => total + item.newPrice * item.quantity, 0);
  cart.updatedAt = Date.now();
}
