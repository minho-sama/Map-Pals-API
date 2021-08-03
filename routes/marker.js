const express = require('express');
const router = express.Router();
const markerController = require('../controllers/markerControllers')

//majd app.use-zal protectelni, nem egyesével!
const extractToken = require('../middlewares/extractToken')
const verifyToken = require('../middlewares/verifyToken')

//getting all markers
router.get('/markers', markerController.markers_get) 

//getting user's friends' markers (and own markers)
router.get('/markers/user/friends/:id', markerController.markers_get_byFriends) 

//getting markers by user
router.get('/markers/user/:id', markerController.markers_get_byUser)
 
//creating marker
router.post('/marker/create', extractToken, verifyToken, markerController.marker_post)

//get all comments for a marker
router.get('/marker/:id/comments', markerController.marker_comments_get)

//create comment
router.post('/marker/:id/comment/create', extractToken, verifyToken, markerController.comment_post)

//delete comment
router.delete('/marker/comment/:id/delete', extractToken, verifyToken, markerController.comment_delete)

//like comment 
router.patch('/marker/comment/:id/like', extractToken, verifyToken, markerController.comment_like_patch)

//like marker
router.patch('/marker/:id/like', extractToken, verifyToken, markerController.marker_like_patch)

//add marker to bookmark
router.patch('/marker/:id/bookmark', extractToken, verifyToken, markerController.bookmark_post)
 
//delete marker, marker from bookmarks, and all comments of the marker
router.delete('/marker/:id/delete', extractToken, verifyToken, markerController.marker_delete)

module.exports = router