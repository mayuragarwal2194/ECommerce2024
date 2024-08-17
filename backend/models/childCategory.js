const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const childCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  parent: {  // Changed from 'parents' to 'parent'
    type: Schema.Types.ObjectId,
    ref: 'ParentCategory',
    required: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  megaMenu: {
    type: Boolean,
    default: false,
  },
  childImage: {
    type: String,
    default: ''
  },
  showInNavbar: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Compound index to ensure unique name within each parent
childCategorySchema.index({ name: 1, parent: 1 }, { unique: true });  // Changed 'parents' to 'parent'

module.exports = mongoose.model('ChildCategory', childCategorySchema);