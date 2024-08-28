const ChildCategory = require('../models/childCategory');
const ParentCategory = require('../models/parentCategory');
const Product = require('../models/product');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Helper function to clean up category name
const cleanName = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
};

const safeToString = (value) => (value ? value.toString() : '');

// Helper function to delete files from a directory
const deleteFiles = (files) => {
  files.forEach(file => {
    const filePath = path.join(__dirname, '../uploads/categories/child_image', file);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      } else {
        // Optionally log the successful deletion
        // console.log(`Deleted file ${filePath}`);
      }
    });
  });
};

// Add a new child category
exports.addChildCategory = async (req, res) => {
  let { name, parent, megaMenu, showInNavbar } = req.body;

  // Validate name length
  if (!name || cleanName(name).length < 3) {
    return res.status(400).json({ message: 'Name is required and should be at least 3 characters long' });
  }

  // Clean up name
  name = cleanName(name);

  // Validate parent category
  if (!parent) {
    return res.status(400).json({ message: 'Parent category is required' });
  }

  let parentId;
  try {
    // Check if parent is an ObjectId or name
    if (/^[0-9a-fA-F]{24}$/.test(parent)) {
      // Parent is an ObjectId
      parentId = parent;
    } else {
      // Parent is a name
      parent = cleanName(parent);
      const parentCategory = await ParentCategory.findOne({ name: parent });
      if (!parentCategory) {
        return res.status(400).json({ message: 'Parent category does not exist' });
      }
      parentId = parentCategory._id;
    }

    // Check if the child category already exists for the given parent
    const existingChildCategory = await ChildCategory.findOne({ name, parent: parentId });
    if (existingChildCategory) {
      return res.status(400).json({ message: 'This child category name already exists under the selected parent category' });
    }

    // Get the parent category to find its top category
    const parentCategory = await ParentCategory.findById(parentId);
    if (!parentCategory) {
      return res.status(400).json({ message: 'Parent category does not exist' });
    }

    const topCategoryId = parentCategory.topCategory;

    // Check the megaMenu limit for child categories
    if (megaMenu) {
      const childMegaMenuCount = await ChildCategory.countDocuments({
        megaMenu: true,
        parent: { $in: await ParentCategory.find({ topCategory: topCategoryId }).select('_id') }
      });

      if (childMegaMenuCount >= 3) {
        return res.status(400).json({ message: 'Maximum limit of 3 child categories with megaMenu set to true per TopCategory exceeded.' });
      }
    }

    // Handle file upload
    let childImage = '';
    if (req.files && req.files.length > 0) {
      const file = req.files.find(file => file.fieldname === 'childImage');
      if (file) {
        childImage = file.path; // Store the file path
      }
    }

    // Create new child category
    const newChildCategory = new ChildCategory({
      name,
      parent: parentId,
      megaMenu,
      showInNavbar,
      childImage
    });

    const savedChildCategory = await newChildCategory.save();

    // Update parent category to include new child
    await ParentCategory.findByIdAndUpdate(parentId, { $push: { children: savedChildCategory._id } });

    res.status(201).json(savedChildCategory);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name === 1 && error.keyPattern.parent === 1) {
      // MongoDB duplicate key error
      return res.status(400).json({ message: 'This child category name already exists under the selected parent category' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update a Child Category
exports.updateChildCategory = async (req, res) => {
  const childCategoryId = req.params.id;
  let { name, parent, megaMenu, showInNavbar } = req.body;

  // Validate name length if it's included in the request body
  if (name && cleanName(name).length < 3) {
    return res.status(400).json({ message: 'Name should be at least 3 characters long' });
  }

  // Clean up name if it's included in the request body
  if (name) {
    name = cleanName(name);
  }

  // Initialize parentId
  let parentId;

  // Validate parent category if it's included in the request body
  if (parent) {
    if (mongoose.Types.ObjectId.isValid(parent)) {
      parentId = parent;
    } else {
      parent = cleanName(parent);
      const parentCategory = await ParentCategory.findOne({ name: parent });
      if (!parentCategory) {
        return res.status(400).json({ message: 'Parent category does not exist' });
      }
      parentId = parentCategory._id;
    }
  }

  try {
    // Find the existing child category
    const existingChildCategory = await ChildCategory.findById(childCategoryId);
    if (!existingChildCategory) {
      return res.status(404).json({ message: 'Child Category Not Found' });
    }

    // Prepare update data
    const updateData = {
      name: name || existingChildCategory.name,
      megaMenu: megaMenu !== undefined ? (megaMenu === 'true' || megaMenu === true) : existingChildCategory.megaMenu,
      showInNavbar: showInNavbar !== undefined ? (showInNavbar === 'true' || showInNavbar === true) : existingChildCategory.showInNavbar,
    };

    // Check the megaMenu limit if megaMenu is being set to true
    if (megaMenu && !existingChildCategory.megaMenu) {
      const parentCategory = await ParentCategory.findById(parentId || existingChildCategory.parent);
      if (!parentCategory) {
        return res.status(400).json({ message: 'Parent category not found' });
      }

      const topCategoryId = parentCategory.topCategory;
      const parentIds = (await ParentCategory.find({ topCategory: topCategoryId })).map(pc => pc._id);
      const megaMenuCount = await ChildCategory.countDocuments({
        parent: { $in: parentIds },
        megaMenu: true,
      });

      if (megaMenuCount >= 3) {
        return res.status(400).json({ message: 'Maximum limit of 3 child categories with megaMenu set to true per TopCategory exceeded.' });
      }
    }

    // Handle parent update only if it has changed
    if (parentId && existingChildCategory.parent && safeToString(existingChildCategory.parent) !== safeToString(parentId)) {
      // Remove child category from the old parent
      await ParentCategory.updateOne(
        { _id: existingChildCategory.parent },
        { $pull: { children: childCategoryId } }
      );

      // Add child category to the new parent
      await ParentCategory.updateOne(
        { _id: parentId },
        { $addToSet: { children: childCategoryId } } // Use $addToSet to prevent duplicate entries
      );

      // Update the parent in the child category
      updateData.parent = parentId;
    } else if (parentId) {
      // If there's no change in parent but parentId is valid, ensure it's added to the parent's children
      if (safeToString(existingChildCategory.parent) !== safeToString(parentId)) {
        await ParentCategory.updateOne(
          { _id: parentId },
          { $addToSet: { children: childCategoryId } } // Use $addToSet to prevent duplicate entries
        );

        // Update the parent in the child category
        updateData.parent = parentId;
      }
    }


    // Handle file upload for childImage
    if (req.files && req.files.length > 0) {
      const file = req.files.find(file => file.fieldname === 'childImage');
      if (file) {
        // Delete the old childImage if it exists
        if (existingChildCategory.childImage) {
          const oldImagePath = path.join(__dirname, '..', 'uploads', 'categories', 'child_image', existingChildCategory.childImage);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error('Failed to delete old image:', err);
            }
          });
        }

        // Update with the new file path
        updateData.childImage = file.path;
      }
    }

    // Update the child category
    const updatedChildCategory = await ChildCategory.findByIdAndUpdate(childCategoryId, updateData, { new: true });

    if (!updatedChildCategory) {
      return res.status(404).json({ message: 'Child category not found' });
    }

    res.json(updatedChildCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Delete a child category
exports.deleteChildCategory = async (req, res) => {
  const childCategoryId = req.params.id;

  try {
    const deletedChildCategory = await ChildCategory.findByIdAndDelete(childCategoryId);
    if (!deletedChildCategory) {
      return res.status(404).json({ message: 'Child Category Not Found' });
    }

    // Delete the child image if it exists
    if (deletedChildCategory.childImage) {
      // Extract the filename from the path
      const fileName = path.basename(deletedChildCategory.childImage);
      deleteFiles([fileName]); // Pass only the filename
    }

    // Remove child reference from parent categories
    await ParentCategory.updateMany({ children: childCategoryId }, { $pull: { children: childCategoryId } });

    // Remove child reference from products
    await Product.updateMany({ childCategory: childCategoryId }, { $set: { childCategory: null } });

    res.json({ message: 'Child category deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all child categories
exports.getAllChildCategories = async (req, res) => {
  try {
    const childCategories = await ChildCategory.find()
      .populate({
        path: 'parent',
        populate: { path: 'topCategory' } // Populate topCategory within parent
      })
      .populate('products');

    res.json(childCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a single child category by ID
exports.getChildById = async (req, res) => {
  const childCategoryId = req.params.id;

  try {
    // Find the child category by ID and populate its parent categories
    const child = await ChildCategory.findById(childCategoryId).populate('parent').populate('products');

    // If the child category is not found, return a 404 status with a message
    if (!child) {
      return res.status(404).json({ message: 'Child Category Not Found' });
    }

    // Return the found child category
    res.json(child);
  } catch (error) {
    // If there is an error, return a 400 status with the error message
    res.status(400).json({ message: error.message });
  }
}






