const Cart = require('../../models/cart');
const User = require('../../models/user');
const Product = require('../../models/product');
const Size = require('../../models/size');

// Main Add To Cart Function
exports.addToCart = async (req, res) => {
  const { productId, variantId, quantity, selectedSize, selectedColor } = req.body;
  const userId = req.user.id;

  console.log("Incoming request:", { userId, productId, variantId, quantity, selectedSize, selectedColor });

  try {
    // Step 1: Validate product and variant
    const { product, variant } = await getValidatedProduct(productId, variantId, selectedColor);
    if (!product || !variant) {
      console.warn(`Validation failed: Product or variant not found`, { productId, variantId, selectedColor });
      return res.status(404).json({
        message: `Product with ID ${productId}, variant ${variantId}, or color ${selectedColor} not found.`,
      });
    }

    // Step 2: Validate quantity
    const parsedQuantity = parseQuantity(quantity);
    if (!parsedQuantity || parsedQuantity <= 0) {
      console.warn("Invalid quantity received:", quantity);
      return res.status(400).json({ message: "Invalid quantity. It must be greater than zero." });
    }

    // Step 3: Resolve size and check stock
    const resolvedSizeId = await resolveSizeId(selectedSize);
    if (!resolvedSizeId) {
      console.warn("Invalid size selected:", selectedSize);
      return res.status(400).json({ message: "Invalid size selected." });
    }

    const stockAvailable = getSizeStock(variant, resolvedSizeId);
    if (!stockAvailable || stockAvailable <= 0) {
      console.warn("Size out of stock:", { resolvedSizeId, stockAvailable });
      return res.status(400).json({ message: "Selected size is out of stock." });
    }

    if (parsedQuantity > stockAvailable) {
      console.warn("Insufficient stock:", {
        stockAvailable,
        requested: parsedQuantity,
      });
      return res.status(400).json({
        message: `Not enough stock. Available: ${stockAvailable}, Requested: ${parsedQuantity}.`,
      });
    }

    // Step 4: Update or create the cart
    const cart = await findOrCreateCart(userId);

    // Add weight from variant
    const weight = variant.attributes.weight;

    if (!weight || typeof weight !== 'number') {
      throw new Error(`Invalid weight for the item. Received: ${weight}`);
    }

    const updatedCart = await updateCart(cart, {
      productId,
      variantId,
      resolvedSizeId,
      selectedColor,
      parsedQuantity,
      product,
      weight, // Include weight for each cart item
    });

    res.status(201).json({ message: "Product added to cart", cart: updatedCart });
  } catch (error) {
    console.error("Error adding to cart:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

/* ==================== Helper Functions ==================== */

// Validate product, variant, and color
async function getValidatedProduct(productId, variantId, selectedColor) {
  const product = await Product.findOne({ _id: productId, "variants._id": variantId });
  if (!product) return null;

  const variant = product.variants.id(variantId);
  if (!variant || variant.attributes.color !== selectedColor) return null;

  return { product, variant };
}

// Resolve size to ObjectId
async function resolveSizeId(size) {
  if (isObjectId(size)) return size;
  const sizeDoc = await Size.findOne({ sizeName: size.toLowerCase() });
  return sizeDoc ? sizeDoc._id : null;
}

// Check if value is a valid ObjectId
function isObjectId(value) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

// Get stock for a specific size
function getSizeStock(variant, sizeId) {
  return variant.sizeStock?.get(sizeId.toString()) || 0;
}

// Parse and validate quantity
function parseQuantity(quantity) {
  const parsed = parseInt(quantity, 10);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
}

// Find or create a cart for the user
async function findOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await User.findByIdAndUpdate(userId, { cart: cart._id });
  }
  return cart;
}

// Update the cart with the new item
async function updateCart(cart, { productId, variantId, resolvedSizeId, selectedColor, parsedQuantity, product, weight }) {
  const variant = product.variants.find(v => v._id.toString() === variantId);
  if (!variant) {
    throw new Error("Variant not found for the given product.");
  }

  // Check stock availability once
  const stockAvailable = getSizeStock(variant, resolvedSizeId);
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.productId.equals(productId) &&
      item.variantId.equals(variantId) &&
      item.size.toString() === resolvedSizeId.toString() &&
      item.color === selectedColor
  );

  const totalRequestedQuantity =
    existingItemIndex > -1
      ? cart.items[existingItemIndex].quantity + parsedQuantity
      : parsedQuantity;

  if (totalRequestedQuantity > stockAvailable) {
    throw new Error(`Not enough stock. Available: ${stockAvailable}`);
  }

  // Update or add item to the cart
  if (existingItemIndex !== -1) {
    cart.items[existingItemIndex].quantity = totalRequestedQuantity;
  } else {
    cart.items.push({
      productId,
      variantId,
      quantity: parsedQuantity,
      size: resolvedSizeId,
      color: selectedColor,
      newPrice: variant.newPrice,
      oldPrice: variant.oldPrice,
      weight,
    });
  }

  // Consolidate price and weight calculations
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

  return await cart.save();
}