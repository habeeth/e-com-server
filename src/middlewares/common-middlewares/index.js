const jsonwebtoken = require('jsonwebtoken');

exports.requireSignin = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).json({ message: "Authorization required" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedDetails = jsonwebtoken.verify(token, process.env.SECRET_OR_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            //This will return response if any problem with decoding token or jwt expired.
            return res.status(400).json({ message: "Something went wrong during token decode.", error: err });
        } else {
            // console.log("requireSignin", decoded);
            return decoded;
        }
    });
    // console.log("decodedDetails", decodedDetails);
    req.user = decodedDetails;
    next();
}

exports.adminValidate = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({ message: "Admin Access Denied", reason: req.user.role + " role is not allowed to perform this operation" });
    }
    next();
};

exports.userValidate = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(400).json({ message: "User Access Denied", reason: req.user.role + " role is not allowed to perform this operation" });
    }
    next();
};

exports.allowAllUsers = (req, res, next) => {
    if (!(['admin', 'user']).includes(req.user.role)) {
        return res.status(400).json({ message: "Access Denied", reason: req.user.role + " role is not allowed to perform this operation" });
    }
    next();
};