const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const mongoose = require("mongoose"); // For CommonJS
const fs = require("fs");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ditfrzog6",
  api_key: "175674277883678",
  api_secret: "mMMu_KeI0GV5cxGpH7LS2zFFBKk", // Click 'View API Keys' above to copy your API secret
});

// Create Prouct
const createProduct = asyncHandler(async (req, res) => {
  const {
    sku,
    title,
    category,
    quantity,
    price,
    description,
    color,
    size,
    location,
  } = req.body;

  //   Validation
  // if (!name || !category || !quantity || !price || !description) {
  //   res.status(400);
  //   throw new Error("Please fill in all fields");
  // }

  if (!sku || !quantity || !price) {
    //  || !category  || !color
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to Cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "StyleAsh Inventory",
        resource_type: "image",
      });

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };

      // Delete the file from the uploads folder
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully from uploads folder");
        }
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
  }

  // Create Product
  const product = await Product.create({
    // user: req.user.id,
    title,
    sku,
    category,
    color,
    size,
    quantity,
    price,
    location,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
  // const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  const products = await Product.find().sort("-createdAt");
  res.status(200).json(products);
});

// Get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  // if (product.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }
  res.status(200).json(product);
});

// Delete Product
// const deleteProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid ID format" });
//   }
//   console.log(req.params.id);
//   console.log(product);
//   // if product doesnt exist
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }
//   // Match product to its user
//   // if (product.user.toString() !== req.user.id) {
//   //   res.status(401);
//   //   throw new Error("User not authorized");
//   // }
//   await product.remove();
//   res.status(200).json({ message: "Product deleted." });
// });
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  console.log("Request ID:", id);

  try {
    // Find and delete the product
    const result = await Product.findByIdAndDelete(id);
    console.log("Deletion result:", result);

    // Check if the product exists and was deleted
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product successfully removed");
    res.status(200).json({ message: "Product deleted." });
  } catch (error) {
    // Log and respond with error
    console.error("Error during deletion:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    sku,
    title,
    category,
    quantity,
    price,
    description,
    color,
    size,
    location,
  } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  // if (product.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }

  // // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to Cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "StyleAsh Inventory",
        resource_type: "image",
      });

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };

      // Delete the file from the uploads folder
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully from uploads folder");
        }
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      title,
      sku,
      category,
      quantity,
      price,
      description,
      color,
      size,
      location,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      // runValidators: true,
    }
  );

  // let updateFields = {};
  // if (req.user.role === "sub-admin") {
  //   if (
  //     sku ||
  //     title ||
  //     category ||
  //     price ||
  //     description ||
  //     color ||
  //     size ||
  //     location ||
  //     req.file
  //   ) {
  //     res.status(403);
  //     throw new Error("You do not have permission to perform this action.");
  //   }
  //   // Sub-admin can only update the quantity
  //   updateFields = { quantity };
  // } else if (req.user.role === "admin") {
  //   // Admin can update all fields
  //   updateFields = {
  //     title,
  //     sku,
  //     category,
  //     quantity,
  //     price,
  //     description,
  //     color,
  //     size,
  //     location,
  //     image: Object.keys(fileData).length === 0 ? product?.image : fileData,
  //   };
  // }

  // // Update the product
  // const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
  //   new: true,
  //   // runValidators: true,
  // });

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
