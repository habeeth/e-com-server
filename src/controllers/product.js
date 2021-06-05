const productModel = require("../models/productModel");
const slugify = require('slugify');

exports.createProduct = (req, res) => {
    // productModel
    const { name, price, description, category, quantity } = req.body;
    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }
    // console.log("productPictures", productPictures);
    const product = new productModel({
        name,
        slug: slugify(name),
        price,
        description,
        category,
        productPictures,
        quantity,
        createdBy: req.user._id
    });
    product.save((error, product) => {
        if (error) res.status(400).json({ message: "Error while creating Product", error: error });
        if (product) {
            res.status(201).json({
                // req.file -- for single image upload
                //req.files -- for array of images
                status: "Success", product: product
            });
        }
    });

};