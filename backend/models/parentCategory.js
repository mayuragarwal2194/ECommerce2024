const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parentCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  topCategory: {
    type: Schema.Types.ObjectId,
    ref: 'TopCategory',
    required: true,
  },
  parentImage: {
    type: String,
    default: ''
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'ChildCategory',
  }],
  showInNavbar: {
    type: Boolean,
    default: true,
  },
  megaMenu: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Define compound index on name and topCategory
parentCategorySchema.index({ name: 1, topCategory: 1 }, { unique: true });

module.exports = mongoose.model('ParentCategory', parentCategorySchema);
