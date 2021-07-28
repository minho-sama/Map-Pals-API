const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers')
const extractToken = require('../middlewares/extractToken')
const verifyToken = require('../middlewares/verifyToken')

router.post('/signup', authController.signup_post)

router.post('/login', authController.login_post)

router.post('/checkToken', extractToken, verifyToken, authController.checkToken)

module.exports = router