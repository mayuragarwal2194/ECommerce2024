const Product = require('../models/product');
const childCategory = require('../models/childCategory');
const ParentCategory = require('../models/parentCategory');
const Size = require('../models/size');
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");

// Add a product
const addProduct = async (req, res) => {
  try {
    const {
      id,
      itemName,
      newPrice,
      oldPrice,
      isPopular,
      shortDescription,
      fullDescription,
      stockStatus,
      tag,
      variants, // JSON string from frontend
      category
    } = req.body;

    // Check if a product with the given id already exists
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this id already exists.' });
    }

    // Parse and process variants data from JSON string
    const parsedVariants = await Promise.all(JSON.parse(variants).map(async (variant, index) => {
      const sizeArray = Array.isArray(variant.attributes.size) ? variant.attributes.size : [variant.attributes.size];
      const sizeIds = await Promise.all(
        sizeArray.map(async size => {
          // Check if the size is already an ObjectId (using a regex to validate ObjectId format)
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(size);

          if (isObjectId) {
            return size; // Directly return if it's an ObjectId
          } else {
            // Otherwise, look up the ID by size name
            const sizeDoc = await Size.findOne({ sizeName: size.toLowerCase() });
            return sizeDoc ? sizeDoc._id : null;
          }
        })
      );

      // Validate that sizeStock matches attributes.size
      const sizeStockKeys = Object.keys(variant.sizeStock || {});
      const sizeNames = sizeArray.map(size => size.toLowerCase());

      const isValidStock = sizeNames.every(size => sizeStockKeys.includes(size));
      if (!isValidStock || sizeStockKeys.length !== sizeNames.length) {
        throw new Error(`Size stock does not match the sizes provided for variant with SKU: ${variant.sku}`);
      }

      return {
        ...variant,
        attributes: {
          ...variant.attributes,
          size: sizeIds.filter(id => id !== null) // Filter out any nulls in case of missing sizes
        },
        variantFeaturedImage: null, // Placeholder
        variantGalleryImages: []    // Placeholder
      };
    }));


    // Create and save the new product without images
    const newProduct = new Product({
      id,
      itemName,
      newPrice,
      oldPrice,
      isPopular,
      shortDescription,
      fullDescription,
      featuredImage: null, // Placeholder
      galleryImages: [],    // Placeholder
      stockStatus,
      tag,
      variants: parsedVariants, // Include variants when creating the product
      category
    });

    await newProduct.save();

    // Add the new product ID to the products array of the child category
    await childCategory.findByIdAndUpdate(category, { $push: { products: newProduct._id } });

    // If the product is successfully added, proceed to handle images
    const featuredImage = req.files.find(file => file.fieldname === 'featuredImage')?.filename || null;
    const galleryImages = req.files.filter(file => file.fieldname === 'galleryImages').map(file => file.filename) || [];

    // Update product with images
    newProduct.featuredImage = featuredImage;
    newProduct.galleryImages = galleryImages;

    // Handle variant images after saving the product
    newProduct.variants = await Promise.all(parsedVariants.map(async (variant, index) => {
      const variantFeaturedImageKey = `variantFeaturedImage${index}`;
      const variantGalleryImagesKey = `variantGalleryImages${index}`;
      const variantFeaturedImage = req.files.find(file => file.fieldname === variantFeaturedImageKey)?.filename || null;
      const variantGalleryImages = req.files.filter(file => file.fieldname === variantGalleryImagesKey).map(file => file.filename) || [];

      return { ...variant, variantFeaturedImage, variantGalleryImages };
    }));

    // Save the product again with the updated images and variant data
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error in addProduct:', error);

    // Cleanup: delete any uploaded files if the process failed
    cleanupUploadedFiles(req.files);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to delete uploaded files(If product adding failed)
const cleanupUploadedFiles = async (files) => {
  if (files) {
    for (const file of files) {
      let filePath;

      if (file.fieldname === 'featuredImage') {
        filePath = path.join(__dirname, '..', 'uploads', 'featured', file.filename);
      } else if (file.fieldname === 'galleryImages') {
        filePath = path.join(__dirname, '..', 'uploads', 'gallery', file.filename);
      } else if (file.fieldname.startsWith('variantFeaturedImage')) {
        filePath = path.join(__dirname, '..', 'uploads', 'variants', 'featured', file.filename);
      } else if (file.fieldname.startsWith('variantGalleryImages')) {
        filePath = path.join(__dirname, '..', 'uploads', 'variants', 'gallery', file.filename);
      }

      if (filePath) {
        try {
          console.log('Attempting to delete file:', filePath);
          await fs.promises.unlink(filePath);
          console.log('Successfully deleted file:', filePath);
        } catch (err) {
          console.error('Failed to delete image during cleanup:', filePath, err);
        }
      }
    }
  } else {
    console.log('No files to clean up.');
  }
};


// Update Product
const FEATURED_DIR = path.join(__dirname, '..', 'uploads', 'featured');
const GALLERY_DIR = path.join(__dirname, '..', 'uploads', 'gallery');

const updateProduct = async (req, res) => {
  try {
    const productId = req.params._id;
    const {
      itemName,
      newPrice,
      oldPrice,
      isPopular,
      shortDescription,
      fullDescription,
      stockStatus,
      tag,
      category,
      variants
    } = req.body;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (itemName !== undefined) existingProduct.itemName = itemName;
    if (newPrice !== undefined) existingProduct.newPrice = newPrice;
    if (oldPrice !== undefined) existingProduct.oldPrice = oldPrice;
    if (isPopular !== undefined) existingProduct.isPopular = isPopular;
    if (shortDescription !== undefined) existingProduct.shortDescription = shortDescription;
    if (fullDescription !== undefined) existingProduct.fullDescription = fullDescription;
    if (stockStatus !== undefined) existingProduct.stockStatus = stockStatus;
    if (tag !== undefined) existingProduct.tag = tag;

    if (category !== undefined) {
      const categoryDoc = await childCategory.findOne({ _id: category });
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      const categoryId = categoryDoc._id;

      if (existingProduct.category.toString() !== categoryId.toString()) {
        await childCategory.findByIdAndUpdate(existingProduct.category, { $pull: { products: existingProduct._id } });
        await childCategory.findByIdAndUpdate(categoryId, { $push: { products: existingProduct._id } });
        existingProduct.category = categoryId;
      }
    }

    // Update featured image and delete the old one
    if (req.files?.find(file => file.fieldname === 'featuredImage')) {
      const oldFeaturedImagePath = path.join(FEATURED_DIR, existingProduct.featuredImage);
      const featuredImage = req.files.find(file => file.fieldname === 'featuredImage').filename;
      existingProduct.featuredImage = featuredImage;

      if (fs.existsSync(oldFeaturedImagePath)) {
        fs.unlink(oldFeaturedImagePath, (err) => {
          if (err) {
            console.error(`Failed to delete old featured image: ${err.message}`);
          }
        });
      }
    }

    // Update gallery images and delete the old ones
    if (req.files?.some(file => file.fieldname === 'galleryImages')) {
      const oldGalleryImagesPaths = existingProduct.galleryImages.map(img => path.join(GALLERY_DIR, img));
      const newGalleryImages = req.files.filter(file => file.fieldname === 'galleryImages').map(file => file.filename);
      existingProduct.galleryImages = newGalleryImages;

      oldGalleryImagesPaths.forEach(imagePath => {
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Failed to delete old gallery image: ${err.message}`);
            }
          });
        }
      });
    }

    // Update variants if provided
    if (variants !== undefined) {
      let parsedVariants;
      try {
        parsedVariants = JSON.parse(variants);
      } catch (parseError) {
        return res.status(400).json({ message: 'Invalid variants JSON format', error: parseError.message });
      }

      const updatedVariants = await Promise.all(parsedVariants.map(async (variant, index) => {
        const variantFeaturedImageKey = `variantFeaturedImage${index}`;
        const variantGalleryImagesKey = `variantGalleryImages${index}`;
        const variantFeaturedImage = req.files?.find(file => file.fieldname === variantFeaturedImageKey)?.filename || variant.variantFeaturedImage;
        const variantGalleryImages = req.files?.filter(file => file.fieldname === variantGalleryImagesKey).map(file => file.filename) || variant.variantGalleryImages;

        const sizeArray = Array.isArray(variant.attributes.size) ? variant.attributes.size : [variant.attributes.size];
        const sizeIds = await getSizeIds(sizeArray);

        // Validate that sizeStock matches attributes.size
        const sizeStockKeys = Object.keys(variant.sizeStock || {});
        const sizeNames = sizeArray.map(size => size.toLowerCase());

        const isValidStock = sizeNames.every(size => sizeStockKeys.includes(size));
        if (!isValidStock || sizeStockKeys.length !== sizeNames.length) {
          throw new Error(`Size stock does not match the sizes provided for variant with SKU: ${variant.sku}`);
        }


        // console.log(`Size IDs for variant ${index}:`, sizeIds);

        return {
          ...variant,
          variantFeaturedImage: variantFeaturedImage || existingProduct.variants[index]?.variantFeaturedImage,
          variantGalleryImages: variantGalleryImages.length > 0 ? variantGalleryImages : existingProduct.variants[index]?.variantGalleryImages,
          attributes: {
            ...variant.attributes,
            size: sizeIds.length > 0 ? sizeIds : existingProduct.variants[index]?.attributes.size // Use new sizes or retain existing ones
          }
        };
      }));

      // console.log("Final Updated Variants:", updatedVariants);

      existingProduct.variants = updatedVariants;
    }


    await existingProduct.save();
    res.status(200).json({ message: 'Product updated successfully', product: existingProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to get size IDs
const getSizeIds = async (sizeArray) => {
  if (!sizeArray || sizeArray.length === 0) {
    console.log("No size identifiers provided.");
    return [];
  }

  // Log the identifiers being processed
  console.log("Size identifiers to convert:", sizeArray);

  const sizeIds = await Promise.all(sizeArray.map(async identifier => {
    // Check if the identifier is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      console.log("Valid ObjectId provided:", identifier);
      return identifier;
    } else {
      // Log the size name being queried
      console.log("Querying size by name:", identifier.toLowerCase());
      const sizeDoc = await Size.findOne({ sizeName: identifier.toLowerCase() });
      // console.log("Size document found:", sizeDoc);
      return sizeDoc ? sizeDoc._id : null;
    }
  }));

  // Log the size IDs that were resolved
  console.log("Size IDs resolved:", sizeIds);

  return sizeIds.filter(id => id !== null);
};

// Get all Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')  // Populate the category field
      .populate({
        path: 'variants',
        populate: [
          {
            path: 'attributes.size',  // Populate sizes within variants
            model: 'size'
          }
        ]
      });

    // Post-processing to ensure sizeStock is in correct format if needed
    const processedProducts = products.map(product => {
      product.variants = product.variants.map(variant => {
        // Ensure sizeStock is correctly represented
        variant.sizeStock = Object.fromEntries(variant.sizeStock);
        return variant;
      });
      return product;
    });

    res.json(processedProducts);
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};



// Get product by id
const getProductById = async (req, res) => {
  try {
    const productId = req.params._id;
    const product = await Product.findById(productId).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: 'Failed to fetch product details' });
  }
};

// Helper function to delete files from a directory
const deleteFiles = (files, dir) => {
  files.forEach(file => {
    const filePath = path.join(__dirname, '../uploads', dir, file);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      } else {
        // console.log(`Deleted file ${filePath}`);
      }
    });
  });
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product to be deleted
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product with this ID not found' });
    }

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product with this ID not found' });
    }

    // Remove product reference from associated child categories
    await childCategory.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    // Delete the featured image if it exists
    if (deletedProduct.featuredImage) {
      deleteFiles([deletedProduct.featuredImage], 'featured');
    }

    // Delete the gallery images if they exist
    if (deletedProduct.galleryImages.length > 0) {
      deleteFiles(deletedProduct.galleryImages, 'gallery');
    }

    // Delete variant images if they exist
    if (deletedProduct.variants.length > 0) {
      deletedProduct.variants.forEach(variant => {
        if (variant.variantFeaturedImage) {
          deleteFiles([variant.variantFeaturedImage], 'variants/featured');
        }
        if (variant.variantGalleryImages.length > 0) {
          deleteFiles(variant.variantGalleryImages, 'variants/gallery');
        }
      });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products by Top category id
const getProductsByTopCategory = async (req, res) => {
  try {
    const topCategoryId = req.params.categoryId;
    // console.log('Top Category ID:', topCategoryId);

    // Find parent categories for the given top category
    const parentCategories = await ParentCategory.find({ topCategory: topCategoryId });
    // console.log('Parent Categories:', parentCategories);

    if (!parentCategories.length) {
      return res.status(404).json({ message: 'No parent categories found for this top category' });
    }

    // Extract parent category IDs
    const parentCategoryIds = parentCategories.map(parent => parent._id);
    // console.log('Parent Category IDs:', parentCategoryIds);

    // Find child categories for the given parent categories
    const childCategories = await childCategory.find({ parent: { $in: parentCategoryIds } });
    // console.log('Child Categories:', childCategories);

    if (!childCategories.length) {
      return res.status(404).json({ message: 'No child categories found for these parent categories' });
    }

    // Extract child category IDs
    const childCategoryIds = childCategories.map(child => child._id);
    // console.log('Child Category IDs:', childCategoryIds);

    // Find products associated with the child categories
    const products = await Product.find({ category: { $in: childCategoryIds } });
    // console.log('Products:', products);

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get All Products by Parent Category id
const getProductsByParentCategory = async (req, res) => {
  try {
    const parentCategoryId = req.params.categoryId;
    console.log('Parent Category ID:', parentCategoryId);

    // Find child categories for the given parent category
    const childCategories = await childCategory.find({ parent: parentCategoryId });
    console.log('Child Categories:', childCategories);

    if (!childCategories.length) {
      return res.status(404).json({ message: 'No child categories found for this parent category' });
    }

    // Extract child category IDs
    const childCategoryIds = childCategories.map(child => child._id);
    console.log('Child Category IDs:', childCategoryIds);

    // Find products associated with the child categories
    const products = await Product.find({ category: { $in: childCategoryIds } });
    console.log('Products:', products);

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by parent category:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get All Products by Child Category Id
const getProductsByChildCategory = async (req, res) => {
  try {
    const childCategoryId = req.params.categoryId;
    console.log('Child Category ID:', childCategoryId);

    // Find products associated with the given child category
    const products = await Product.find({ category: childCategoryId });
    console.log('Products:', products);

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this child category' });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by child category:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};





module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductsByTopCategory,
  getProductsByParentCategory,
  getProductsByChildCategory
};