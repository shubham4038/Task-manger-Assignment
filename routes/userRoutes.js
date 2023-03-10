const express = require('express');
const userController = require('../controllers/authController')


const router = express.Router();

router.route('/signup').post(userController.signup)
router.route('/login').post(userController.login);
router.route('/verifyOtp').patch(userController.verifyOtp);

module.exports = router;

