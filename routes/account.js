const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
const upload = require('../middlewares/post_img')

router.get('/user/:id', async (req, res) => {
  try{
    const user = await User.findById(req.params.id)
    res.json(user)
  } catch(err){
    return res.status(400).json({err: err.message})
  }
})

//uploading image, and returning a file name which was created in the middleware
router.post('/profile', upload.single("file"), (req, res) => {
  return res.json({file_name: req.file.filename})
}) 

module.exports = router;
