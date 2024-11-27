const Cart = require('../../models/cart');
const Product = require('../../models/product');

// Main getCart function
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await fetchUserCart(userId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return res.status(200).json([]); // Return an empty array if cart is empty
    }

    // Format and send the cart response
    const formattedCart = formatCartResponse(cart);
    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to fetch the user's cart with required population
async function fetchUserCart(userId) {
  return Cart.findOne({ userId })
    .populate({
      path: 'items.productId',
      select: 'itemName tag featuredImage',
      populate: {
        path: 'variants',
        select: 'newPrice oldPrice variantFeaturedImage sizeStock attributes.size attributes.color attributes.weight',
        populate: {
          path: 'attributes.size',
          select: 'sizeName',
        },
      },
    });
}

// Helper function to format the cart response
function formatCartResponse(cart) {
  return {
    _id: cart._id,
    userId: cart.userId,
    items: cart.items.map(formatCartItem),
    totalPrice: cart.totalPrice,
    totalWeight: calculateCartWeight(cart.items), // Include total weight
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
}

// Updated formatCartItem to include sizeStock
function formatCartItem(item) {
  const variant = findVariant(item);

  let sizeName = null;
  let sizeStock = 0;

  if (variant) {
    // Debugging logs for Map handling
    console.log("Cart Size ID:", item.size);
    console.log("Variant Size Stock Object:", variant.sizeStock);

    // Check if sizeStock is a Map and use appropriate method
    const stockValue = variant.sizeStock instanceof Map
      ? variant.sizeStock.get(item.size.toString()) // Use .get() for Map
      : variant.sizeStock ? variant.sizeStock[item.size.toString()] : null; // Default to object access

    console.log("Stock for Size ID:", stockValue);

    // Find the size object using the size ID stored in the cart
    const size = variant.attributes.size.find(
      (s) => s._id.toString() === item.size.toString()
    );

    sizeName = size ? size.sizeName : null;
    sizeStock = stockValue || 0; // Set sizeStock to stockValue or default to 0
  }

  return {
    _id: item._id,
    productId: item.productId._id,
    variantId: item.variantId,
    itemName: item.productId.itemName,
    tag: item.productId.tag,
    newPrice: variant ? variant.newPrice : null,
    oldPrice: variant ? variant.oldPrice : null,
    featuredImage: variant ? variant.variantFeaturedImage : item.productId.featuredImage,
    color: variant ? variant.attributes.color : null,
    size: sizeName, // Use size name
    sizeStock, // Include size stock
    quantity: item.quantity,
    weight: variant ? variant.attributes.weight : 0,
    addedAt: item.createdAt,
  };
}


// Helper function to find the variant in the product that matches the cart item's variantId
function findVariant(item) {
  return item.productId.variants.find((variant) => variant._id.equals(item.variantId));
}

// Calculate total weight of the cart
function calculateCartWeight(items) {
  return items.reduce((totalWeight, item) => {
    const variant = findVariant(item);
    const weight = variant && variant.attributes.weight ? variant.attributes.weight : 0;
    return totalWeight + weight * item.quantity;
  }, 0);
}