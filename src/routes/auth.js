express = require('express');
const { signup, signin } = require('../controllers/auth');
const router = express.Router();
const { validateSignUpRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');

router.post('/signup', validateSignUpRequest, isRequestValidated, signup);

router.post('/signin', validateSigninRequest, isRequestValidated, signin);

// router.post('/requireSignin', requireSignin, (req, res) => {
//     res.status(200).json({
//         meassage: "Token verified Sucessfully"
//     });
// });

module.exports = router;