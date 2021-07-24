const express = require('express');
const router = express.Router();
// const markerController = require('../controllers/markerControllers')
const Marker = require('../models/MarkerModel')

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

//commenteket is itt intézni, de ne egy route-on! előbb renderelni a markert a sidebarban, és useEffectel fetchelni commenteket sidebarban!
//kell ez egyáltalán? amikor map-olom a markereket, úgyis ott van minden infó
router.get('/marker/:id', (req, res) => {

})

router.post('/marker/create', extractToken, verifyToken, async (req, res) => {
    
    try{
        const marker = await Marker.create({
            user: req.body.user,
            lat: req.body.lat,
            lng:req.body.lng,
            name: req.body.name,
            description: req.body.description,
            image_url: req.body.img_url
        })
        res.status(201).json(marker)
    } catch(err) {
        res.status(400).json({err: err.message})
    }
})

module.exports = router