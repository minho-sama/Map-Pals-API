const mongoose = require('mongoose')
const Schema = mongoose.Schema
const formatDistance = require('date-fns/formatDistance')

const opts = { toJSON: { virtuals: true } };

const CommentSchema = new Schema({
    marker: {        
        type:Schema.Types.ObjectId, 
        ref: 'marker', 
        required:true
    },
    user: {
        type:Schema.Types.ObjectId, 
        ref: 'user', 
        required:true
    },
    content: {type:String, required:true},
    post_date: {
        type:Date,
        default:Date.now
    },
    likes: [{        
        type:Schema.Types.ObjectId, 
        ref: 'user', 
    }]
}, opts)

CommentSchema
    .virtual('time_since_post')
    .get(function() {
        return formatDistance(
                this.post_date,
                Date.now(),
                { addSuffix: true }
        )
    })

const Comment = mongoose.model('comment', CommentSchema)

module.exports = Comment