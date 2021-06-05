const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/product');
const { requireSignin, adminValidate, allowAllUsers } = require('../middlewares/common-middlewares');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const shortid = require('shortid');
const path = require('path');
const slugify = require('slugify');

//copied from npm website
//path returns current parent directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, slugify(req.body.name) + '-' + shortid.generate() + '-' + file.originalname);
    }
});

let upload = multer({ storage: storage });
//upload.single('productPicture') -- for single picture upload
router.post('/product/create', requireSignin, adminValidate, upload.array('productPicture'), createProduct);
// router.get('/product/fetch', requireSignin, allowAllUsers, getAllProduct);


module.exports = router;