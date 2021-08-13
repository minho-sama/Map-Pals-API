const Marker = require('../models/MarkerModel')
const User = require('../models/UserModel')
const Comment = require('../models/CommentModel')

module.exports.markers_get = async (req, res) => {
    try {
        const allMarkers = await Marker.find()
                                       .select("-user.password") //not working
                                       .populate('user')
        return res.status(200).json(allMarkers)
    } catch(err){
        return res.status(403).json({err: err.message})
    }
}
  
module.exports.markers_get_byFriends = async (req, res) => {
    try {
        const allMarkers = await Marker.find()
                                       .select("-user.password")
                                       .populate('user')
        const friendsMarkers = allMarkers.filter(marker => {
            return marker.user.friends.includes(req.params.id) || marker.user._id == req.params.id
        })
        return res.status(200).json(friendsMarkers)
    } catch(err){
        return res.status(500).json({err: err.message})
    }
}

module.exports.markers_get_byUser = async (req, res) => {
    try{
        const userMarkers = await Marker.find({user:req.params.id})
        return res.status(200).json(userMarkers)
    }catch(err){
        return res.status(400).json({err:err.message})
    }
}

module.exports.marker_post = async (req, res) => {
    
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
}

module.exports.marker_comments_get = async (req, res) => {
    try{
        const comments = await Comment.find({marker: req.params.id})
                                      .select('-password')
                                      .populate('user')
                                      .sort({post_date:-1})
        res.status(200).json(comments)
    } catch(err){
        res.status(400).json({err:err.message})
    }
}

module.exports.comment_post = async (req, res) => {
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
}

module.exports.comment_delete = async (req, res) => {
    try{
        const deletedComment = await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedComment)
    } catch(err){
        res.status(400).json({err:err.message})
    }
}

module.exports.comment_like_patch = async (req, res) => {
    try{
        const likedComment = await Comment.updateOne({_id:req.params.id}, {$set: {
            likes: req.body.likes
        }})
        return res.status(200).json(likedComment)
    }catch(err){
        res.status(403).json({err:err.message})
    }
}

module.exports.marker_like_patch = async (req, res) => {
    try{
        const likedMarker = await Marker.updateOne({_id:req.params.id}, {$set:{
            likes:req.body.likes
        }})
        return res.status(200).json(likedMarker)
    } catch(err) {
        res.status(403).json({err:err.message})
    }
}

module.exports.bookmark_post = async (req, res) => {
    try{
        const bookmarkedMarker = await User.updateOne({_id:req.params.id}, {$set:{
            bookmarks:req.body.bookmarks
        }})
        return res.status(200).json(bookmarkedMarker)
    } catch(err) {
        res.status(403).json({err:err.message})
    }
}

module.exports.marker_delete = async (req, res) => {
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
}