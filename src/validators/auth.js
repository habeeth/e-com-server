const { check, validationResult } = require('express-validator');

exports.validateSignUpRequest = [
    check('firstName').notEmpty().withMessage('First Name is Required..'),
    check('lastName').notEmpty().withMessage('Last Name is Required..'),
    check('email').isEmail().withMessage('Email is Required..'),
    check('password').isLength({ min: 6 }).withMessage('Password Should be 6 chars long..'),
];

exports.validateSigninRequest = [
    check('email').isEmail().withMessage('Email is Required..'),
    check('password').isLength({ min: 6 }).withMessage('Password Should be 6 chars long..'),
];


exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);//get errors from req using predefined 
    if (errors.array().length > 0) {
        // return res.status(400).json({ error: getErrors(errors) });
        return res.status(400).json({ error: errors.array()[0].msg });
    } else {
        next();
    }
};

let getErrors = payload => {
    if (payload) {
        let lengthOfError = payload.array().length;
        let error = {};
        for (i = 0; i < lengthOfError; i++) {
            error.push(payload.array()[i].msg);
        }
        return error;
    }
}