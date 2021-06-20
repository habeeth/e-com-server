const categoryModel = require("../../models/categoryModel")
const productModel = require("../../models/productModel")

exports.initialData = async (req, res) => {
    const categories = await categoryModel.find({}).exec();
    const products = await productModel.find({})
        .select('_id name slug price quantity description productPictures category')
        .exec();
    // const products = await productModel.find({})
    //     .select('_id name')
    //     .populate('category')
    //     .exec();
    res.status(200).json({
        categoriesList: structureResultByRecursiveFn(categories), products
    });
}

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
            parentId: i.parentId,
            children: structureResultByRecursiveFn(categories, i._id)
        });
    }
    return categoriesList;
}