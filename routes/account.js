const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken')
const verifyToken = require('../middlewares/verifyToken');
const userController = require('../controllers/accountControllers')

//get all users
router.get('/users', userController.users_get)

//get 1 user
router.get('/user/:id', userController.user_get)

//update user info
router.patch('/user/:id/info', extractToken, verifyToken, userController.user_patch)

//Send friend request
router.patch('/user/:id/sendFR', extractToken, verifyToken, userController.friendRequest_send)

//Accept friend request 
//idReceiver idSender
router.patch('/user/:idR/:idS', extractToken, verifyToken, userController.friendRequest_accept)

//DECLINE friend request 
//idReceiver idSender
router.patch('/user/:idR/:idS/decline', extractToken, verifyToken, userController.friendRequest_decline)

//uploading image, and returning a file name which was created in the middleware
router.post('/profile', upload.single("file"), userController.image_post) 
 
module.exports = router;
