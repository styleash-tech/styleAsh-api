const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const restrict = require("../middleWare/restrict");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");
const exportProducts = require("../utils/exportProducts");
const importFile = require("../utils/importFile");

router.post(
  "/",
  protect,
  restrict.restrictTo("admin"),
  upload.single("image"),
  createProduct
);

router.post(
  "/import-products",
  protect,
  restrict.restrictTo("admin"),
  upload.single("file"),
  importFile.importProducts
);

router.patch(
  "/:id",
  protect,
  restrict.restrictTo("admin", "sub-admin"),
  upload.single("image"),
  updateProduct
);
router.get("/", protect, getProducts);
router.get("/export-products", protect, exportProducts.exportProducts);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, restrict.restrictTo("admin"), deleteProduct);

module.exports = router;
