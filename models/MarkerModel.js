 const mongoose = require('mongoose')
 const Schema = mongoose.Schema
 const {DateTime} = require('luxon')
 const formatDistance = require('date-fns/formatDistance')
 
const opts = { toJSON: { virtuals: true } };

const MarkerSchema = new Schema({
    user: {
        type:Schema.Types.ObjectId, 
        ref: 'user', 
        required:true
    },
    lat:{type:Number, required:true},
    lng:{type:Number, required:true},
    name:{
        type:String,
        required:true
    },
    imgUrl: {
        type:String,
        default: "https://i.imgur.com/qBJ1H0r.jpg"
    },
    description: {
        type:String,
        required:true
    },
    likes: [{type:Schema.Types.ObjectId, ref: 'user'}],
    post_date: {type:Date, default: Date.now}
}, opts)

MarkerSchema
    .virtual('post_date_formatted')
    .get(function() {
        return DateTime.fromJSDate(this.post_date).toLocaleString(DateTime.DATE_MED)
    })

const Marker = mongoose.model('marker', MarkerSchema)

module.exports = Marker