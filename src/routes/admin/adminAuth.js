const express = require('express');
const { signup, signin, signout } = require('../../controllers/admin/adminAuth');
const { requireSignin } = require('../../middlewares/common-middlewares');
const router = express.Router();
const { validateSignUpRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');

router.post('/admin/signup', validateSignUpRequest, isRequestValidated, signup);

router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);

router.post('/admin/signout', signout);//removed requireSignin, as this method returns false incase of expired tokens,

// router.post('/requireSignin', requireSignin, (req, res) => {
//     res.status(200).json({
//         meassage: "Token verified Sucessfully"
//     });
// });

module.exports = router;