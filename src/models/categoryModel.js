const mongoose = require('mongoose');
const categoyShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    catPictures: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    parentId: {
        type: String
    }
}, { timestamps: true });

let categoryModel = mongoose.model('Category', categoyShema);
module.exports = categoryModel;