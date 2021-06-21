const UserModel = require('../models/userModel');
const jsonwebtoken = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

exports.signup = (req, res) => {

    UserModel.findOne({ email: req.body.email })
        .exec(async (error, user) => {
            if (user) {
                return res.status(400).json({
                    message: "User Already Exists"
                });
            }
            else if (error) {
                return res.status(400).json({
                    message: "Something went wrong while finding...",
                    error: error
                });
            }

            const {
                firstName,
                lastName,
                email,
                password
            } = req.body;
            const hash_password = await bcryptjs.hash(password, 10);
            const _user = new UserModel({
                firstName,
                lastName,
                email,
                hash_password,
                username: Math.random().toString()
            });

            _user.save((error, data) => {
                console.log('logger', error);
                if (error) {
                    return res.status(400).json({
                        message: "Something went wrong while creating..."
                    });
                }

                if (data) {
                    return res.status(201).json({
                        message: "User Signup Successful"
                    });
                }
            });

        });
};

exports.signin = (req, res) => {
    UserModel.findOne({ email: req.body.email })
        .exec((error, user) => {
            if (error) return res.status(400).json({ message: "User Not Found", error: error });
            if (user) {
                if (user.authenticate(req.body.password)) {
                    const token = jsonwebtoken.sign({ _id: user._id, role: user.role }, process.env.SECRET_OR_PRIVATE_KEY, { expiresIn: '1h' })
                    // ,
                    //     (err, token) => {
                    //         if (err) return res.status(400).json({ message: "Something went wrong in jwt.", error: err });
                    //         return token;
                    //     });
                    const { firstName, lastName, fullName, email, role } = user;
                    res.status(200).json({
                        token,
                        user: {
                            firstName, lastName, fullName, email, role
                        }
                    })
                } else {
                    return res.status(400).json({
                        message: "Invalid Password"
                    });
                }
            } else {
                return res.status(400).json({ message: "Something went wrong on signin findOne" });
            }
        });
};

