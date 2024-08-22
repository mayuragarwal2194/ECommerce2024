const ParentCategory = require('../models/parentCategory');
const TopCategory = require('../models/topCategory');
const fs = require('fs');
const path = require('path');


// Helper function to clean up category name
const cleanName = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
};

// exports.getAllTopCategories = async (req, res) => {
//   try {
//     const topCategories = await TopCategory.find().populate('children');
//     console.log(JSON.stringify(topCategories, null, 2)); // Log the fetched categories with children
//     res.json(topCategories);
//   } catch (error) {
//     console.error(error); // Log any errors
//     res.status(500).json({ message: error.message });
//   }
// }


// Get a single Top category by ID
exports.getTopById = async (req, res) => {
  try {
    const topCategoryId = req.params.id;
    const topCategory = await TopCategory.findById(topCategoryId).populate('children');

    if (!topCategory) {
      return res.status(404).json({ message: 'Top category not found' });
    }
    res.json(topCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add a new Top Category
exports.addTopCategory = async (req, res) => {
  let { name, megaMenu, showInNavbar } = req.body;

  // Validate name length
  if (!name || cleanName(name).length < 3) {
    return res.status(400).json({ message: 'Name is required and should be at least 3 characters long' });
  }

  // Clean up name
  name = cleanName(name);

  // Convert megaMenu and showInNavbar to boolean values if they are not already
  megaMenu = typeof megaMenu === 'boolean' ? megaMenu : megaMenu === 'false' ? false : true;
  showInNavbar = typeof showInNavbar === 'boolean' ? showInNavbar : showInNavbar === 'false' ? false : true;

  try {
    // Check if a category with the same name already exists
    const existingTopCategory = await TopCategory.findOne({ name });
    if (existingTopCategory) {
      return res.status(400).json({ message: 'Top Category with this name already exists' });
    }

    // Handle file upload
    let topImage = '';
    if (req.files && req.files.length > 0) {
      const file = req.files.find(file => file.fieldname === 'topImage');
      if (file) {
        topImage = file.path; // Store the file path
      }
    }

    const newTopCategory = new TopCategory({
      name,
      showInNavbar,
      megaMenu,
      topImage
    });

    const savedTopCategory = await newTopCategory.save();
    res.status(201).json(savedTopCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update a Top Category
exports.updateTopCategory = async (req, res) => {
  const topCategoryId = req.params.id;

  if (req.body.name && cleanName(req.body.name).length < 3) {
    return res.status(400).json({ message: 'Name should be at least 3 characters long' });
  }

  // Clean up the name, if it's included in the request body
  if (req.body.name) {
    req.body.name = cleanName(req.body.name);
  }

  try {
    // Fetch the existing top category
    const existingTopCategory = await TopCategory.findById(topCategoryId);
    if (!existingTopCategory) {
      return res.status(404).json({ message: 'Top category not found' });
    }

    // Handle file upload for topImage
    if (req.files && req.files.length > 0) {
      const file = req.files.find(file => file.fieldname === 'topImage');
      if (file) {
        // Delete the old image if it exists
        if (existingTopCategory.topImage) {
          const oldImagePath = path.join(__dirname, '..', existingTopCategory.topImage);
          fs.unlink(oldImagePath, err => {
            if (err) console.error('Failed to delete old image:', err);
          });
        }

        // Update the topImage path in the request body
        req.body.topImage = file.path; // Store the new file path
      }
    }

    // Update the top category with the new data
    const updatedTopCategory = await TopCategory.findByIdAndUpdate(topCategoryId, req.body, { new: true });

    if (!updatedTopCategory) {
      return res.status(404).json({ message: 'Top category not found' });
    }

    res.json(updatedTopCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete a Top Category
exports.deleteTopCategory = async (req, res) => {
  const topCategoryId = req.params.id;

  try {
    const deletedTopCategory = await TopCategory.findOneAndDelete({ _id: topCategoryId });
    if (!deletedTopCategory) {
      return res.status(404).json({ message: 'Top Category Not Found' });
    }

    // Set Top Category reference to null in its child categories
    await ParentCategory.updateMany({ topCategory: topCategoryId }, { $set: { topCategory: null } });

    res.json({ message: 'Top category deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// New function to get child categories by parent category ID
exports.getParentCategoriesByTopId = async (req, res) => {
  try {
    const topCategoryId = req.params.id;

    const topCategory = await TopCategory.findById(topCategoryId).populate('children');
    if (!topCategory) {
      return res.status(404).json({ message: 'Top category not found' });
    }
    res.json(topCategory.children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getTopCategoriesWithParentsAndChildren = async (req, res) => {
  try {
    const topCategories = await TopCategory.find()
      .populate({
        path: 'children', // Parent categories
        match: { showInNavbar: true },
        populate: {
          path: 'children', // Child categories within parent categories
          match: { showInNavbar: true }
        }
      })
      .exec();
    res.json(topCategories);
    // console.log(topCategories);
  } catch (error) {
    console.error('Error fetching top categories with parents and children:', error);
    res.status(500).json({ message: 'Failed to fetch top categories with parent and child categories' });
  }
};
