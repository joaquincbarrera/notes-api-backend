
require('dotenv').config()
require('./utils/mongo')

const express = require('express')
const cors = require('cors')

const logger = require('./middleware/logger')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')

const app = express()

app.use(express.json()) 
app.use(cors())
app.use(logger) 

app.get('/', (request, response) => response.send('<h1>Hello World!</h1>'))

app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)
app.use('/api/login', loginRouter)

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

process.on('SIGINT', function() {
    console.log( '(Ctrl-C) server exit' )
    // some other closing procedures go here
    process.exit(0)
})

process.on('uncaughtException', function() {
    console.log( '(uncaughtException) server exit' )
    // some other closing procedures go here
    process.exit(0)
})

module.exports = {app, server}