const express = require('express');
const { signup, signin } = require('../../controllers/admin/adminAuth');
const router = express.Router();
const { validateSignUpRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');

router.post('/admin/signup', validateSignUpRequest, isRequestValidated, signup);

router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);

// router.post('/requireSignin', requireSignin, (req, res) => {
//     res.status(200).json({
//         meassage: "Token verified Sucessfully"
//     });
// });

module.exports = router;