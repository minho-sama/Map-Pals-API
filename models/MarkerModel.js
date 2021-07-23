 const mongoose = require('mongoose')
 const Schema = mongoose.Schema

const markerSchema = new Schema({
    user: {
        type:Schema.Types.ObjectId, 
        ref: 'User', 
        required:true
    },
    lat:{type:Number, required:true},
    lng:{type:Number, required:true},
    name:{
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    img_url: {
        type:String,
        default: 'https://i.imgur.com/RPapTGV.png'
    },
    likes: [{type:Schema.Types.ObjectId, ref: 'User'}],
    post_date: {type:Date, default: Date.now}

})

markerSchema
    .virtual('data_formatted')
    .get(function() {
        return this.post_date + 'formatted'
    })

const Marker = mongoose.model('marker', markerSchema)

module.exports = Marker