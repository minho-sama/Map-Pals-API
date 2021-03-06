const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

const upload = require('../middlewares/post_img')
router.post('/profile', upload.single("file"), (req, res) => {
  return res.json(req.file.filename)
}) 

module.exports = router;
