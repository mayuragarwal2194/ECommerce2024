const Cart = require('../../models/cart');
const Product = require('../../models/product');

// Main updateQuantity function
exports.updateQuantity = async (req, res) => {
  const { cartId, productId, variantId, newQuantity, selectedSize, selectedColor } = req.body;
  const userId = req.user.id;

  try {
    const quantity = parseQuantity(newQuantity);
    if (quantity === null) {
      return res.status(400).json({ message: "Invalid quantity." });
    }

    // Fetch the cart and item index
    const cart = await findUserCart(cartId, userId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const itemIndex = findCartItemIndex(cart, productId, variantId, selectedSize, selectedColor);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    // Validate product and variant
    const { product, variant } = await validateProductAndVariant(productId, variantId);
    if (!product || !variant) {
      return res.status(404).json({ message: "Product or variant not found." });
    }

    // Validate stock for selected size
    const sizeStock = getSizeStock(variant, selectedSize);
    if (typeof sizeStock === 'undefined') {
      return res.status(400).json({ message: "Selected size does not have a stock entry." });
    }

    if (!validateStockAvailability(quantity, sizeStock)) {
      return res.status(400).json({ message: `Not enough stock available for the selected size. Available stock: ${sizeStock}` });
    }

    // Update cart items and total
    updateCartItem(cart, itemIndex, quantity);
    updateCartTotal(cart);

    await cart.save();

    res.status(200).json({ message: 'Cart item updated', cart });
  } catch (error) {
    console.error('Error updating quantity:', error.stack);
    res.status(500).json({ error: error.message });
  }
};


// Helper function to get the stock for a specific size
function getSizeStock(variant, selectedSize) {
  return variant.sizeStock.get(selectedSize.toString());
}

// Helper function to parse and validate quantity
function parseQuantity(quantity) {
  const parsedQuantity = parseInt(quantity, 10);
  return isNaN(parsedQuantity) || parsedQuantity <= 0 ? null : parsedQuantity;
}

// Helper function to update the total price of the cart
function updateCartTotal(cart) {
  cart.totalPrice = cart.items.reduce((total, item) => total + item.newPrice * item.quantity, 0);
  cart.updatedAt = Date.now();
}

// Helper function to find the user's cart
async function findUserCart(cartId, userId) {
  return Cart.findOne({ _id: cartId, userId });
}

// Helper function to find the index of the item in the cart
function findCartItemIndex(cart, productId, variantId, selectedSize, selectedColor) {
  return cart.items.findIndex(item =>
    item.productId.equals(productId) &&
    item.variantId.equals(variantId) &&
    item.size === selectedSize &&
    item.color === selectedColor
  );
}

// Helper function to validate the product and variant
async function validateProductAndVariant(productId, variantId) {
  const product = await Product.findOne({ _id: productId, "variants._id": variantId });
  if (!product) return { product: null, variant: null };
  const variant = product.variants.id(variantId);
  return { product, variant };
}

// Helper function to validate stock availability
function validateStockAvailability(quantity, sizeStock) {
  return quantity <= sizeStock;
}

// Helper function to update the item quantity or remove it from cart if quantity is zero
function updateCartItem(cart, itemIndex, quantity) {
  if (quantity === 0) {
    // Remove item if quantity is zero
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity for existing item
    cart.items[itemIndex].quantity = quantity;
  }
}