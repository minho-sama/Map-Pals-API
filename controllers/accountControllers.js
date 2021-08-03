const User = require('../models/UserModel')
const upload = require('../middlewares/post_img')

module.exports.users_get = async (req, res) => {
    try{
      const users = await User.find().select("-password").populate('friendRequests', 'username')
      res.status(200).json(users)
    } catch(err){
      res.status(400).json({err: err.message})
    }
}

module.exports.user_get = async (req, res) => {
    try{ 
      const user = await User.findById(req.params.id)
                             .select('-password')
                             .populate('friendRequests', '-password')
                             .populate('friends', '-password')
      res.json(user)
    } catch(err){
      return res.status(400).json({err: err.message})
    }
}

module.exports.user_patch = async (req, res) => {
    try{
      const [updateMsg, updatedUser ] = await Promise.all([
        await User.updateOne({_id:req.params.id}, {$set: {
          city: req.body.city,
          bio: req.body.bio,
          imgUrl: req.body.imgUrl
        }}),
        await User.findById(req.params.id)
                  .populate('friendRequests', '-password') //according to documentation double populate shouldn't work, but it does
                  .populate('friends', '-password')
      ])
      res.status(200).json(updatedUser)
    }catch(err){
      res.status(400).json({err:err.message})
    }
}

module.exports.friendRequest_send = async (req, res) => {
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
}

module.exports.friendRequest_accept = async (req, res) => {
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
}

module.exports.friendRequest_decline = async (req, res) => {
    try{
      const [userDecliner, userDUpdated] = await Promise.all([
        await User.updateOne({_id: req.params.idR}, {$set:{
          friendRequests: req.body.friendRequestsReceiver
        }}),
        await User.findById(req.params.idR)
                  .populate('friendRequests', 'username')
                  .populate('friends', 'username')
      ])
      res.status(200).json(userDUpdated)
    } catch(err){
      res.status(400).json({err: err.message})
    }
}

module.exports.image_post = (req, res) => {
    return res.json({file_name: req.file.filename})
  }
