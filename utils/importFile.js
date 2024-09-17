const csv = require("csvtojson");
const fs = require("fs");
const Products = require("../models/productModel");

const importProducts = async (req, res) => {
  try {
    // Check if a file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload a CSV file.",
      });
    }

    // Check if the file exists on the path
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({
        success: false,
        message: "Uploaded file does not exist.",
      });
    }

    // Initialize products array
    let products = [];

    // Check if the file is CSV
    const fileType = req.file.mimetype;

    if (fileType === "text/csv") {
      // Convert CSV to JSON
      const response = await csv().fromFile(req.file.path);
      // console.log("CSV response:", response);

      // Check if the CSV file has data
      if (response.length === 0) {
        return res.status(400).json({
          success: false,
          message: "CSV file is empty.",
        });
      }

      // Validate the data in CSV rows
      for (let i = 0; i < response.length; i++) {
        if (!response[i].sku) {
          return res.status(400).json({
            success: false,
            message: `Missing required fields in row ${i + 1}. SKU is missing.`,
          });
        }

        // Push to products array after validation
        products.push({
          title: response[i].title || "",
          sku: response[i].sku,
          price: response[i].price || 0,
          category: response[i].category || "",
          color: response[i].color || "",
          quantity: response[i].quantity || 0,
          location: response[i].location || "",
          description: response[i].description || "",
        });
      }

      // Insert products into the database
      await Products.insertMany(products);

      // Return success response
      res.status(200).json({
        success: true,
        message: "Products imported successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format. Please upload a CSV file.",
      });
    }
  } catch (err) {
    console.error("Error while importing products:", err.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    // Clean up: Delete the uploaded file from the server
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

module.exports = {
  importProducts,
};
