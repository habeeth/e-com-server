const CartModel = require("../models/cartModel");

exports.addItemsToCart = (req, res) => {
    CartModel.findOne({ user: req.user._id })
        .exec((error, cart) => {
            if (error) res.status(400).json({ message: "Error while findone from cart", error: error });
            console.log("Found an item in cart", cart);
            let condition, action;
            if (cart) {
                const product = req.body.cartItems.product;
                const item = cart.cartItems.find(c => c.product == product);
                if (item) {
                    condition = { "user": req.user._id, "cartItems.product": product };
                    payload = {
                        "$set": {
                            "cartItems.$": {
                                ...req.body.cartItems,
                                quantity: item.quantity + req.body.cartItems.quantity
                            }
                        }
                    }
                } else {
                    console.log("push items to cart");
                    condition = { user: req.user._id };
                    payload = {
                        "$push": {
                            "cartItems": req.body.cartItems
                        }
                    }
                }
                CartModel.findOneAndUpdate(condition, payload).exec((error, _cart) => {
                    if (error) res.status(400).json({ message: "Error while upsert to cart", error: error });
                    if (_cart) {
                        return res.status(200).json({ messsage: "Success", data: cart });
                    }
                });
            } else {
                console.log("creating new item to cart");
                const cart = new CartModel({
                    user: req.user._id,
                    cartItems: [req.body.cartItems]
                });
                cart.save((error, cart) => {
                    if (error) res.status(400).json({ message: "Error while adding to cart", error: error });
                    if (cart) {
                        res.status(200).json({ messsage: "Success", data: cart });
                    }
                });
            }

        });


};