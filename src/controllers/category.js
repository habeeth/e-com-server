const categoryModel = require('../models/categoryModel');
const slugify = require('slugify');

exports.createCategory = (req, res) => {
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name)
    }
    if (req.file) {
        categoryObj.catPictures = process.env.ENDPOINT + '/public/' + req.file.filename;
    }
    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }
    const newCategoryModel = new categoryModel(categoryObj);
    newCategoryModel.save((error, category) => {
        if (error) res.status(400).json({ message: "Error while creating category...", error: error });
        if (category) res.status(200).json({ message: "Category record created successfully...", data: category });
    });
};

exports.getAllCategory = (req, res) => {
    categoryModel.find({}).
        exec((error, categories) => {
            if (error) res.status(400).json({ message: "Error while Fetching all category...", error: error });
            if (categories) {
                let categoriesList = structureResultByRecursiveFn(categories);
                res.status(200).json({ categoriesList: categoriesList });
            }
        });
};

// function structureResultByRecursiveFn(categories, parentId = null) {
structureResultByRecursiveFn = (categories, parentId = null) => {
    let categoriesList = [];
    let parentCategories;
    // console.log("categories", typeof categories);
    if (parentId == null) {
        parentCategories = categories.filter(i => i.parentId == undefined);
    } else {
        parentCategories = categories.filter(i => i.parentId == parentId);
    }

    for (let i of parentCategories) {
        categoriesList.push({
            _id: i._id,
            name: i.name,
            slug: i.slug,
            children: structureResultByRecursiveFn(categories, i._id)
        });
    }
    return categoriesList;
}