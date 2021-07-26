const express = require('express');
const router = express.Router();
// const markerController = require('../controllers/markerControllers')
const Marker = require('../models/MarkerModel')
const User = require('../models/UserModel')

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

//commenteket is itt intézni, de ne egy route-on! előbb renderelni a markert a sidebarban, és useEffectel fetchelni commenteket sidebarban!
//kell ez egyáltalán? amikor map-olom a markereket, úgyis ott van minden infó lol
// router.get('/marker/:id', (req, res) => {

// })

router.get('/marker/:id/comments', (req, res) => {
    //populatelni a user fieldet, markert nem kell
    //UGYANEZ DELETEBEN IS
})

router.post('/marker/:id/comment/create', (req, res) => {

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
    console.log(req.params.id)
    try{
        const deletedMarker = await Marker.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedMarker)
    } catch(err){
        res.status(403).json({err: err.message})
    }
})

module.exports = router