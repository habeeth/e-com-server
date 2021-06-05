const UserModel = require('../../models/userModel');
const jsonwebtoken = require('jsonwebtoken');
exports.signup = (req, res) => {

    UserModel.findOne({ email: req.body.email })
        .exec((error, user) => {
            if (user) {
                return res.status(400).json({
                    message: "Admin Already Exists..."
                });
            }
            else if (error) {
                return res.status(400).json({
                    message: "Something went wrong while finding Admin details...",
                    error: error
                });
            }

            const {
                firstName,
                lastName,
                email,
                password
            } = req.body;

            const _user = new UserModel({
                firstName,
                lastName,
                email,
                password,
                username: Math.random().toString(),
                role: "admin"
            });

            _user.save((error, data) => {
                if (error) {
                    return res.status(400).json({
                        message: "Something went wrong while creating..."
                    });
                }

                if (data) {
                    return res.status(201).json({
                        message: "Admin Signup Successful..."
                    });
                }
            });

        });
};

exports.signin = (req, res) => {
    UserModel.findOne({ email: req.body.email, role: 'admin' })
        .exec((error, user) => {
            if (error) return res.status(400).json({ message: "Admin details Not Found...", error: error });
            if (user) {
                if (user.authenticate(req.body.password)) {
                    const token = jsonwebtoken.sign(
                        { _id: user._id, role: user.role }, process.env.SECRET_OR_PRIVATE_KEY, { expiresIn: '1h' }
                    );
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
                return res.status(400).json({ message: "Admin details Not Found.." });
            }
        });
};
