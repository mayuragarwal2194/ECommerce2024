const Wishlist = require('../models/wishlist');
const User = require('../models/user');
const Product = require('../models/product');

// Add variant to wishlist
exports.addToWishlist = async (req, res) => {
  console.log('Request body Latest:', req.body);
  const { productId, variantId } = req.body;
  const userId = req.user.id;

  try {
    // Validate that the product exists and (if variantId is provided) that the variant belongs to it
    const product = variantId
      ? await Product.findOne({ _id: productId, "variants._id": variantId })
      : await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product or variant not found." });
    }

    // Check if the wishlist exists for the user
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // If not, create a new wishlist
      wishlist = new Wishlist({ userId, products: [] });
    }

    // Check if the item is already in the wishlist
    const exists = wishlist.products.some(
      item => item.productId.equals(productId) && (!variantId || (item.variantId && item.variantId.equals(variantId)))
    );

    if (exists) {
      return res.status(200).json({ message: 'Product already in wishlist', wishlist });
    }

    // Add the product and variant to the wishlist
    wishlist.products.push({ productId, variantId });
    await wishlist.save();

    // Update the user document to reference the wishlist if it's newly created
    await User.findByIdAndUpdate(userId, { wishlist: wishlist._id }, { new: true });

    res.status(201).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Remove variant from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId, variantId } = req.params; // Get product and variant IDs from req.params
  const userId = req.user.id; // Get user ID from req.user

  try {
    // Find and update the wishlist by removing the specified product and variant
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId, variantId } } }, // Remove the specified product and variant
      { new: true } // Return the updated wishlist
    );

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ message: 'Product variant removed from wishlist', wishlist });
    
  } catch (error) {
    console.error('Error removing from wishlist:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ userId })
      .populate({
        path: 'products.productId', // Main product
        select: 'itemName tag', // Fields from main product
        populate: { // Populate the specific variant within the product
          path: 'variants',
          select: 'newPrice oldPrice variantFeaturedImage attributes.size attributes.color', // Fields from the variant
        },
      });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // If the wishlist is empty (products array is empty), return an empty array with status 200
    if (wishlist.products.length === 0) {
      return res.status(200).json([]); // Return an empty array
    }

    // Format the wishlist response to include variant-specific details
    res.status(200).json({
      message: 'Wishlist fetched successfully',
      products: wishlist.products.map(item => {
        // Find the specific variant the user added to the wishlist
        const variant = item.productId.variants.find(variant => variant._id.equals(item.variantId));

        return {
          productId: item.productId._id,
          variantId: item.variantId,
          itemName: item.productId.itemName,
          tag: item.productId.tag,
          newPrice: variant ? variant.newPrice : null,
          oldPrice: variant ? variant.oldPrice : null,
          featuredImage: variant ? variant.variantFeaturedImage : item.productId.featuredImage,
          color: variant ? variant.attributes.color : null,
          size: variant ? variant.attributes.size : null,
          addedAt: item.addedAt,
        };
      }),
    });
    console.log(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


