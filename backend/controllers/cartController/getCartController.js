const Cart = require('../../models/cart');
const Product = require('../../models/product');


// Helper function to fetch the user's cart with required population
async function fetchUserCart(userId) {
  return Cart.findOne({ userId })
    .populate({
      path: 'items.productId',
      select: 'itemName tag featuredImage',
      populate: {
        path: 'variants',
        select: 'newPrice oldPrice variantFeaturedImage attributes.size attributes.color',
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
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
}

// Helper function to format individual cart items
function formatCartItem(item) {
  const variant = findVariant(item);

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
    size: item.size,
    quantity: item.quantity,
    addedAt: item.createdAt,
  };
}

// Helper function to find the variant in the product that matches the cart item's variantId
function findVariant(item) {
  return item.productId.variants.find(variant => variant._id.equals(item.variantId));
}

// Helper function to format size names into a string
function formatSizeNames(sizes) {
  return sizes.map(size => size.sizeName).join(', ');
}


// Main getCart function
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await fetchUserCart(userId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // If the cart is empty, return an empty array with status 200
    if (cart.items.length === 0) {
      return res.status(200).json([]); // Return an empty array
    }

    // Format and send the cart response
    const formattedCart = formatCartResponse(cart);
    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

