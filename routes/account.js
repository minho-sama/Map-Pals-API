const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
const upload = require('../middlewares/post_img')
const extractToken = require('../middlewares/extractToken')
const verifyToken = require('../middlewares/verifyToken')

router.get('/users', async (req, res) => {
  try{
    const users = await User.find().select("-password").populate('friendRequests', 'username')
    res.status(200).json(users)
  } catch(err){
    res.status(400).json({err: err.message})
  }
})

router.get('/user/:id', async (req, res) => {
  try{
    const user = await User.findById(req.params.id)
    res.json(user)
  } catch(err){
    return res.status(400).json({err: err.message})
  }
})

//Send friend request
router.patch('/user/:id/sendFR', extractToken, verifyToken, async (req, res) => {
  try{
    await User.updateOne({_id: req.params.id}, {$set:{
      friendRequests: req.body.friendRequests
    }})
    res.status(200).json({msg: 'friend request sent'})
  }catch(err){
    res.status(400).json({err: err.message})
  }
})

//uploading image, and returning a file name which was created in the middleware
router.post('/profile', upload.single("file"), (req, res) => {
  return res.json({file_name: req.file.filename})
}) 

module.exports = router;
