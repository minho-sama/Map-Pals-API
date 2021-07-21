const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//user img_name-nél dupla fetch: előbb feltölti a képet, majd awaiteli 
//a filename-t, majd azzal a file nammel updateli a user modelt

//VAGY elég egy update fetch, de akkor mindegyik kép neve így nézzen ki: userID-profile-img (marjereknél pedig markerID-place-img)

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true, "Please enter a username"],
        unique:true
    },
    password: {
        type:String,
        required:[true, "Please enter a password"],
        minlength:[3, "minimum password length is 3 characters"]
    }
})

userSchema.post('save', function(doc, next){
    console.log('new user was created and saved', doc)
    next()
})

//fire function before doc saved to db
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//static method to log in user
userSchema.statics.login = async function (username, password) { //no arrow functions because of "this"
    const user = await this.findOne({username: username}) //if not found, user is undefined
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

const User = mongoose.model('user', userSchema)

module.exports = User