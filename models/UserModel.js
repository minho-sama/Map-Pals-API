const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const {DateTime} = require('luxon')

const opts = { toJSON: { virtuals: true } };
const UserSchema = new Schema({
    username: {
        type:String,
        required:[true, "Please enter a username"],
        unique:true
    },
    password: {
        type:String,
        required:[true, "Please enter a password"],
        minlength:[3, "minimum password length is 3 characters"]
    },
    bookmarks: [{type:Schema.Types.ObjectId, ref: 'marker'}],
    city: {type:String},
    join_date: {type:Date, default:Date.now},
    imgUrl: {type:String, default: "https://i.imgur.com/NcPLMqc.jpg"},
    friends: [{type:Schema.Types.ObjectId, ref: 'user'}],
    friendRequests: [{type:Schema.Types.ObjectId, ref: 'user'}]


}, opts)  

UserSchema.post('save', function(doc, next){
    console.log('new user was created and saved', doc)
    next()
})

//fire function before doc saved to db
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//static method to log in user
UserSchema.statics.login = async function (username, password) { //no arrow functions because of "this"
    const user = await this.findOne({username: username})  //if not found, user is undefined
                           .populate('friendRequests', '-password') //according to documentation double populate shouldn't work, but it does
                           .populate('friends', '-password')
    if(user){
        console.log(password, user.password)
        const auth = await bcrypt.compare(password, user.password) //returns boolean
        if(auth){
            console.log('successful login')
            return user
        }
        throw Error('incorrect password')
    }

    throw Error('incorrect username')
}

// UserSchema 
//     .virtual('join_date_formatted')
//     .get(function() {
//         return DateTime.fromJSDate(this.join_date).toLocaleString(DateTime.DATE_MED)
// })

const User = mongoose.model('user', UserSchema)

module.exports = User