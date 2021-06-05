const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    productPictures: [
        {
            img: {
                type: String
            }
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User',
            review: String
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: Date,
}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;