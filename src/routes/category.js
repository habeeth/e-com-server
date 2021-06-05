const express = require('express');
const router = express.Router();
// const categoryModel = require('../models/categoryModel');
const { createCategory, getAllCategory } = require('../controllers/category');
const { requireSignin, adminValidate, allowAllUsers } = require('../middlewares/common-middlewares');
const path = require('path');
const multer = require('multer');
const { default: slugify } = require('slugify');
const shortid = require('shortid');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, slugify(req.body.name) + '-' + shortid.generate() + '-' + file.originalname)
    }
})
let upload = multer({ storage: storage });
router.post('/category/create', requireSignin, adminValidate, upload.single('catPictures'), createCategory);
router.get('/category/fetchAll', requireSignin, allowAllUsers, getAllCategory);

module.exports = router;
