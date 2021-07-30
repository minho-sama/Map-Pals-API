const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
const upload = require('../middlewares/post_img')
const extractToken = require('../middlewares/extractToken')
const verifyToken = require('../middlewares/verifyToken');
const { response } = require('express');

router.get('/users', async (req, res) => {
  try{
    const users = await User.find().select("-password").populate('friendRequests', 'username')
    res.status(200).json(users)
  } catch(err){
    res.status(400).json({err: err.message})
  }
})

//dont protect this one with auth middlewares!
router.get('/user/:id', async (req, res) => {
  try{ 
    const user = await User.findById(req.params.id)
                           .populate('friendRequests', 'username')
                           .populate('friends', 'username')
    res.json(user)
  } catch(err){
    return res.status(400).json({err: err.message})
  }
})

//Send friend request
router.patch('/user/:id/sendFR', extractToken, verifyToken, async (req, res) => {
  try{
    const [updatedUser, user] = await Promise.all([
      await User.updateOne({_id: req.params.id}, {$set:{
        friendRequests: req.body.friendRequests
      }}),
      await User.findById(req.params.id)
                .populate('friendRequests', 'username')
                .populate('friends', 'username')
    ])
    res.status(200).json(user)
  }catch(err){
    res.status(400).json({err: err.message})
  }
})

//Accept friend request 
//idReceiver idSender
router.patch('/user/:idR/:idS', extractToken, verifyToken, async (req, res) => {
  try{
    const [updatedR, updatedS, user] = await Promise.all([
      await User.updateOne({_id: req.params.idR}, {$set:{
        friends: req.body.friendsReceiver,
        friendRequests: req.body.friendRequestsReceiver
      }}),
      await User.updateOne({_id: req.params.idS}, {$set:{
        friends: req.body.friendsSender
      }}),
      await User.findById(req.params.idR)
                .populate('friendRequests', 'username')
                .populate('friends', 'username')
    ])
    res.status(200).json(user)
  } catch(err){
    res.status(400).json({err: err.message})
  }
})
 
//uploading image, and returning a file name which was created in the middleware
router.post('/profile', upload.single("file"), (req, res) => {
  return res.json({file_name: req.file.filename})
}) 

module.exports = router;
