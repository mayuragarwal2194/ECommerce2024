const mongoose = require("mongoose");

const topCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentCategory',
  }],
  showInNavbar: {
    type: Boolean,
    default: true,
  },
  megaMenu: {
    type: Boolean,
    default: false,
  },
  topImage: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('TopCategory', topCategorySchema);