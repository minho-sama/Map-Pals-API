const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')

const handleErrorsSignup = (err) => {
    console.log(err.message, err.code) //err.code for unique username error
    let errors = {username:'', password: ''};

    //duplicate username code error
    if(err.code === 11000){
        errors.username = 'username is already taken'
        return errors
    }

    //validation errors
    if(err.message.includes('user validation failed')){ // coming from the mongo validation from the mongo model
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
        console.log(errors)
    }

    return errors
}

const handleErrorsLogin = (err) => {
    let errors = {email:'', password: ''};

    if(err.message==='incorrect username'){
        errors.email = 'that username is not registered'
    }
    if(err.message==='incorrect password'){
        errors.password = 'that password is incorrect'
    }

    return errors
}

module.exports.signup_post = async (req, res) => {
    const {username, password} = req.body
    try{
        const user = await User.create({
            username,
            password
        })
        res.status(201).json({user})
        //redirectelni usert login pagere, toastify: SIGNUP SUCCESSFUL
    }catch(err){
        const errors = handleErrorsSignup(err)
        res.status(400).json({errors})
    }
}

module.exports.login_post = async (req, res) => {
    const {username, password} = req.body
    try{

        const user = await User.login(username, password)
        //creating token
        jwt.sign({user}, process.env.JWT_SIGN, {expiresIn:'30s'}, (err, token) => { //'1h'
            res.status(200).json({
                user,
                token
            })
        })
        //on the front end, save token to localStorage
        //AFTER receiving token, REDIRECTING to home page
        //home page is protected with a middleware (protectRoute)
        //on every request, attach the token to the request header somehow (utánanézni)
        //https://stackoverflow.com/questions/50536025/save-jwt-to-local-storage

    } catch(err){
        const errors = handleErrorsLogin(err)
        res.status(400).json({errors})
    }
    

}