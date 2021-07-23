const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers')
const User = require('../models/UserModel')

router.post('/signup', authController.signup_post)

router.post('/login', authController.login_post)




//TESTING ROute
const extractToken = require('../middlewares/extractToken')
const verifyToken = require('../middlewares/verifyToken')
// const jwt = require('jsonwebtoken')
router.get('/protectedHomepageTest', extractToken, verifyToken, (req, res) => {

    res.send('you passed verification, this is a protected page')
} )

module.exports = router