const express = require('express');
const router = express.Router();
const upload = require('../middlewares/post_img')

//uploading image, and returning a file name which was created in middleware
router.post('/profile', upload.single("file"), (req, res) => {
  return res.json({file_name: req.file.filename})
}) 

module.exports = router;
