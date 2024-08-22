const ParentCategory = require('../models/parentCategory');
const ChildCategory = require('../models/childCategory');
const TopCategory = require('../models/topCategory');
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');

// Helper function to clean up category name
const cleanName = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Get all parent categories
exports.getAllParentCategories = async (req, res) => {
  try {
    const parentCategories = await ParentCategory.find().populate('children');
    res.json(parentCategories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Parent Categories' });
  }
}

// Get a single parent category by ID
exports.getParentById = async (req, res) => {
  try {
    const parentCategoryId = req.params.id;
    const parent = await ParentCategory.findById(parentCategoryId).populate('children');

    if (!parent) {
      return res.status(404).json({ message: 'Parent category not found' });
    }
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add a new parent category
exports.addParentCategory = async (req, res) => {
  let { name, topCategory, showInNavbar, megaMenu } = req.body;

  // Validate name length
  if (!name || cleanName(name).length < 3) {
    return res.status(400).json({ message: 'Name is required and should be at least 3 characters long' });
  }

  // Clean up name
  name = cleanName(name);

  // Validate top category
  if (!topCategory) {
    return res.status(400).json({ message: 'Top category is required' });
  }

  let topCatId;

  try {
    // Check if Top Category is an ObjectId or name
    if (/^[0-9a-fA-F]{24}$/.test(topCategory)) {
      // Top Category is an ObjectId
      topCatId = topCategory;
    } else {
      // Top Category is a name
      topCategory = cleanName(topCategory);
      const topCategoryFound = await TopCategory.findOne({ name: topCategory });
      if (!topCategoryFound) {
        return res.status(400).json({ message: 'Top category does not exist' });
      }
      topCatId = topCategoryFound._id;
    }

    // Check if a parent category with the same name already exists under the selected top category
    const existingParentCategory = await ParentCategory.findOne({ name, topCategory: topCatId });
    if (existingParentCategory) {
      return res.status(400).json({ message: 'This parent category name already exists under the selected top category' });
    }

    // Check if the top category has showInNavbar set to true
    const topCategoryDoc = await TopCategory.findById(topCatId);
    if (!topCategoryDoc.showInNavbar) {
      return res.status(400).json({ message: 'Cannot add ParentCategory to megaMenu as the associated TopCategory is not shown in the navbar.' });
    }

    // Check the megaMenu limit
    if (megaMenu) {
      const megaMenuCount = await ParentCategory.countDocuments({ topCategory: topCatId, megaMenu: true });
      if (megaMenuCount >= 3) {
        return res.status(400).json({ message: 'Maximum limit of 3 parent categories with megaMenu set to true per TopCategory exceeded.' });
      }
    }

    // Handle file upload
    let parentImage = '';
    if (req.files && req.files.length > 0) {
      const file = req.files.find(file => file.fieldname === 'parentImage');
      if (file) {
        parentImage = file.path; // Store the file path
      }
    }

    // Create new parent category
    const newParentCategory = new ParentCategory({
      name,
      topCategory: topCatId,
      parentImage,
      showInNavbar,
      megaMenu,
    });

    const savedParentCategory = await newParentCategory.save();

    // Update top category to include new parent
    await TopCategory.findByIdAndUpdate(topCatId, { $push: { children: savedParentCategory._id } });

    res.status(201).json(savedParentCategory);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name === 1 && error.keyPattern.topCategory === 1) {
      // MongoDB duplicate key error for compound index
      return res.status(400).json({ message: 'This parent category name already exists under the selected top category' });
    }
    res.status(400).json({ message: error.message });
  }
};



// Update a parent category
exports.updateParentCategory = async (req, res) => {
  const parentCategoryId = req.params.id;
  let { name, topCategory, megaMenu, showInNavbar } = req.body;

  if (name && cleanName(name).length < 3) {
    return res.status(400).json({ message: 'Name should be at least 3 characters long' });
  }

  // Clean up the name, if it's included in the request body
  if (name) {
    name = cleanName(name);
  }

  // Initialize topCatId
  let topCatId;

  // Validate Top category if it's included in the request body
  if (topCategory) {
    // If TopCategory is an ObjectId
    if (mongoose.Types.ObjectId.isValid(topCategory)) {
      topCatId = topCategory;
    } else {
      // If Top Category is a name, find by name
      topCategory = cleanName(topCategory);
      const topCategoryFound = await TopCategory.findOne({ name: topCategory });
      if (!topCategoryFound) {
        return res.status(400).json({ message: 'Top category does not exist' });
      }
      topCatId = topCategoryFound._id;
    }
  }

  try {
    // Find the existing parent category
    const existingParentCategory = await ParentCategory.findById(parentCategoryId);

    if (!existingParentCategory) {
      return res.status(404).json({ message: 'Parent Category Not Found' });
    }

    // Prepare update data
    const updateData = {
      name: name || existingParentCategory.name,
      megaMenu: megaMenu !== undefined ? (megaMenu === 'true' || megaMenu === true) : existingParentCategory.megaMenu,
      showInNavbar: showInNavbar !== undefined ? (showInNavbar === 'true' || showInNavbar === true) : existingParentCategory.showInNavbar,
    };

    // Check the megaMenu limit
    if (updateData.megaMenu && !existingParentCategory.megaMenu) { // Only check if megaMenu is being set to true
      const megaMenuCount = await ParentCategory.countDocuments({ topCategory: topCatId || existingParentCategory.topCategory, megaMenu: true });
      if (megaMenuCount >= 3) {
        return res.status(400).json({ message: 'Maximum limit of 3 parent categories with megaMenu set to true per TopCategory exceeded.' });
      }
    }

    // Handle Top Category update if needed
    if (topCatId && (!existingParentCategory.topCategory || existingParentCategory.topCategory.toString() !== topCatId.toString())) {
      // Remove the Parent category from the old Top category
      if (existingParentCategory.topCategory) {
        await TopCategory.updateOne(
          { _id: existingParentCategory.topCategory },
          { $pull: { children: parentCategoryId } }
        );
      }

      // Add the Parent category to the new Top category
      await TopCategory.updateOne(
        { _id: topCatId },
        { $push: { children: parentCategoryId } }
      );

      // Include top Category ID in the update data
      updateData.topCategory = topCatId;
    }

    // Handle file upload
    if (req.files && req.files.length > 0) {
      const file = req.files.find(file => file.fieldname === 'parentImage');
      if (file) {
        // Delete the old parentImage if it exists
        if (existingParentCategory.parentImage) {
          const oldImagePath = existingParentCategory.parentImage

          // Check if the file exists before attempting to delete
          fs.access(oldImagePath, fs.constants.F_OK, (err) => {
            if (err) {
              console.error('File does not exist:', oldImagePath);
              return;
            }

            // Delete the old image
            fs.unlink(oldImagePath, (err) => {
              if (err) {
                console.error('Failed to delete old image:', err);
              } else {
                console.log('Successfully deleted old image:', oldImagePath);
              }
            });
          });
        }

        // Update with the new file path
        updateData.parentImage = file.path;
      }
    }

    // Update the Parent category
    const updatedParentCategory = await ParentCategory.findByIdAndUpdate(parentCategoryId, updateData, { new: true });

    if (!updatedParentCategory) {
      return res.status(404).json({ message: 'Parent category not found' });
    }

    res.json(updatedParentCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// Delete a parent category
exports.deleteParentCategory = async (req, res) => {
  const parentCategoryId = req.params.id;

  try {
    const deletedParentCategory = await ParentCategory.findByIdAndDelete(parentCategoryId);
    if (!deletedParentCategory) {
      return res.status(404).json({ message: 'Parent Category Not Found' });
    }

    // Delete the featured image if it exists
    if (deletedParentCategory.parentImage) {
      deleteFiles([deletedParentCategory.parentImage]);
    }

    // Remove parent reference from child categories
    await ChildCategory.updateMany({ parent: parentCategoryId }, { $set: { parent: null } });

    // Remove parent reference from Top categories
    await TopCategory.updateMany({ children: parentCategoryId }, { $pull: { children: parentCategoryId } });

    res.json({ message: 'Parent category deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// New function to get child categories by parent category ID
exports.getChildCategoriesByParentId = async (req, res) => {
  try {
    const parentCategoryId = req.params.id;
    const parentCategoryFound = await ParentCategoryIdarentCategory.findById(parentCategoryId).populate('children');
    if (!parentCategoryFound) {
      return res.status(404).json({ message: 'Parent category not found' });
    }
    res.json(parentCategoryFound.children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};