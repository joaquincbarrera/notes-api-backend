const loginRouter = require('express').Router()

const bcryot = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


loginRouter.post('/', async (request, response) => {
    const { username, password} = request.body

    const user = await User.findOne({username})

    const passwordCorrect = (user === null) ? false : await bcryot.compare(password, user.passwordHash)

    if(!passwordCorrect){
        return response.status(401).json({
            error: 'user or password invalid'
        })
    }

    const userForToken = {
        id: user._id,
        username: user.username
    }

    const seconds =  60 * 60 * 24 * 7 // 7 dias expresados en segundos
    const token = jwt.sign(userForToken, process.env.SECRET.substr,{ expiresIn: seconds})

    response.send({
        name: user.name,
        username: user.username,
        token
    })
})

module.exports = loginRouter