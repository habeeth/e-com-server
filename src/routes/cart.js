const express = require('express');
const { addItemsToCart } = require('../controllers/cart');
const { requireSignin, userValidate } = require('../middlewares/common-middlewares');
const router = express.Router();

router.post('/user/cart/create', requireSignin, userValidate, addItemsToCart);

module.exports = router;