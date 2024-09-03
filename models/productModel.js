const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
    title: {
      type: String,
    },
    sku: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    // sku: {
    //   type: String,
    //   required: true,
    //   default: "SKU",
    //   trim: true,
    // },
    category: {
      type: String,
      // required: [true, "Please add a category"],
      trim: true,
    },
    color: {
      type: String,
      // required: [true, "Please add a color"],
      trim: true,
    },
    size: {
      type: String,
      // required: [true, "Please add a size"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Please add a price"],
      trim: true,
    },
    location: {
      type: String,
      // required: [true, "Please add a price"],
      trim: true,
    },
    description: {
      type: String,
      // required: [true, "Please add a description"],
      trim: true,
    },
    // image: {
    //   type: Object,
    //   default: {},
    // },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
