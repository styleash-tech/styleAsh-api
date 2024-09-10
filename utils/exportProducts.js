const Product = require("../models/productModel");
const CsvParser = require("json2csv").Parser;

const exportProducts = async (req, res) => {
  try {
    let produts = [];
    const productData = await Product.find({});

    productData.forEach((produt) => {
      const {
        _id,
        title,
        sku,
        price,
        color,
        size,
        category,
        quantity,
        location,

        updatedAt,
        createdAt,
      } = produt;
      produts.push({
        _id,
        title,
        sku,
        price,
        color,
        size,
        category,
        quantity,
        location,

        updatedAt,
        createdAt,
      });
    });

    const csvFields = [
      "_id",
      "title",
      "sku",
      "price",
      "color",
      "size",
      "category",
      "quantity",
      "location",
      "updatedAt",
      "createdAt",
    ];

    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(produts);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attatchment: filename:Product-Data.csv"
    );

    res.status(200).end(csvData);
  } catch (err) {
    res.send({
      status: 400,
      success: false,
      msg: err.message,
    });
    console.log(err);
  }
};

module.exports = { exportProducts };
