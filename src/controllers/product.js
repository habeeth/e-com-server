const productModel = require("../models/productModel");
const slugify = require('slugify');
const categoryModel = require('../models/categoryModel');

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
            res.status(200).json({
                // req.file -- for single image upload
                //req.files -- for array of images
                hint: "Success", product: product
            });
        }
    });

};

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    try {
        categoryModel.findOne({ slug: slug })
            .exec((err, data) => {
                if (err) res.status(400).json({ error: err });
                if (data && data != null) {
                    productModel.find({ category: data._id }).exec((error, products) => {
                        if (error) res.status(400).json({ error: error });
                        if (products.length > 0) {
                            res.status(200).json({
                                products: products,
                                productsByPrice: {
                                    under5k: products.filter(i => i.price < 5000),
                                    under10k: products.filter(i => i.price >= 5000 && i.price < 10000),
                                    under15k: products.filter(i => i.price >= 10000 && i.price < 15000),
                                    under20k: products.filter(i => i.price >= 15000 && i.price < 30000),
                                    under30k: products.filter(i => i.price >= 30000),
                                }
                            });
                        } else {
                            res.status(201).json({
                                error: 'No data found'
                            })
                        }
                    });
                } else {
                    res.status(201).json({
                        error: 'Invalid Slug'
                    })
                }
            });
    } catch (e) {
        throw new Error(e);
    }

}