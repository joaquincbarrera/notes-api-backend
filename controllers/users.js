const usersRouter = require('express').Router()

const bcryot = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (request, response ) => {
    const { body } = request
    const { username, name, password } = body
    
    const saltRounds = 10
    const passwordHash = await bcryot.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = usersRouter

