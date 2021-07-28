const express = require('express');
const router = express.Router();
// const markerController = require('../controllers/markerControllers')
const Marker = require('../models/MarkerModel')
const User = require('../models/UserModel')
const Comment = require('../models/CommentModel')

//majd app.use-zal protectelni, nem egyesével!
const extractToken = require('../middlewares/extractToken')
const verifyToken = require('../middlewares/verifyToken')


//getting all markers (majd megcsinálni úgy is, h csak friendekre, ne frontenden szűrj!)
//majd ha lesznek kommentek akkor populatelni!
//nem kell verification, majd id alapján lesz úgyis
router.get('/markers', async (req, res) => {
    try {
        const allMarkers = await Marker.find().populate('user', 'username')
        return res.status(200).json(allMarkers)
    } catch(err){
        return res.status(403).json({err: err.message})
    }
}) 
 
router.post('/marker/create', extractToken, verifyToken, async (req, res) => {
    
    try{
        const marker = await Marker.create({
            user: req.body.user,
            lat: req.body.lat,
            lng:req.body.lng,
            name: req.body.name,
            description: req.body.description,
            imgUrl: req.body.imgUrl
        })
        const populatedMarker = await marker.populate('user').execPopulate() //when user creates marker, sidebar immediately renders it, so it needs the user data
        res.status(201).json(populatedMarker)
    } catch(err) {
        res.status(400).json({err: err.message})
    }
})

//get all comments for a marker
router.get('/marker/:id/comments', async (req, res) => {
    try{
        const comments = await Comment.find({marker: req.params.id}).populate('user', 'username').sort({post_date:-1})
        res.status(200).json(comments)
    } catch(err){
        res.status(400).json({err:err.message})
    }
})

//create comment
router.post('/marker/:id/comment/create', extractToken, verifyToken, async (req, res) => {
    try{
        const newComment = await Comment.create({
            marker: req.body.marker,
            user: req.body.user,
            content: req.body.content
        })
        res.status(200).json(newComment)
    } catch(err){
        res.status(400).json({err:err.message})
    }
})

//delete comment
router.delete('/marker/comment/:id/delete', extractToken, verifyToken, async (req, res) => {
    try{
        const deletedComment = await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedComment)
    } catch(err){
        res.status(400).json({err:err.message})
    }
})

//like comment 
router.patch('/marker/comment/:id/like', extractToken, verifyToken, async (req, res) => {
    try{
        const likedComment = await Comment.updateOne({_id:req.params.id}, {$set: {
            likes: req.body.likes
        }})
        return res.status(200).json(likedComment)
    }catch(err){
        res.status(403).json({err:err.message})
    }
})

router.patch('/marker/:id/like', extractToken, verifyToken, async (req, res) => {
    try{
        const likedMarker = await Marker.updateOne({_id:req.params.id}, {$set:{
            likes:req.body.likes
        }})
        return res.status(200).json(likedMarker)
    } catch(err) {
        res.status(403).json({err:err.message})
    }
})

router.patch('/marker/:id/bookmark', extractToken, verifyToken, async (req, res) => {
    try{
        console.log(req.params.id)
        const findUser = await User.findById(req.params.id)
        console.log(findUser)

        const bookmarkedMarker = await User.updateOne({_id:req.params.id}, {$set:{
            bookmarks:req.body.bookmarks
        }})
        return res.status(200).json(bookmarkedMarker)
    } catch(err) {
        res.status(403).json({err:err.message})
    }
})
 
router.delete('/marker/:id/delete', extractToken, verifyToken, async (req, res) => {
    try{
        const [marker, comments, personsWhoBookmarked] = await Promise.all([
            await Marker.findByIdAndDelete(req.params.id),
            await Comment.deleteMany({marker: req.params.id}),
            await User.find({bookmarks: req.params.id})
        ])

        //deleting the markers from the users' bookmark lists
        personsWhoBookmarked.forEach(async (person) => {
          person.bookmarks.splice(person.bookmarks.indexOf(req.params.id), 1)
          await User.updateOne({_id: person._id}, {$set: {
              bookmarks: person.bookmarks
          }})
        })

        res.status(200).json(marker, comments, personsWhoBookmarked)

    } catch(err){
        res.status(400).json({err: err.message})
    }
})

module.exports = router