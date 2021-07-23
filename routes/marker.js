const express = require('express');
const router = express.Router();
// const markerController = require('../controllers/markerControllers')
const Marker = require('../models/MarkerModel')

//majd app.use-zal protectelni, nem egyesével!
const extractToken = require('../middlewares/extractToken')
const verifyToken = require('../middlewares/verifyToken')


//getting all markers (majd megcsinálni úgy is, h csak friendekre, ne frontenden szűrj!)
router.get('/markers', (req, res) => {

})

//commenteket is itt intézni, de ne egy route-on! előbb renderelni a markert a sidebarban, és useEffectel fetchelni commenteket sidebarban!
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