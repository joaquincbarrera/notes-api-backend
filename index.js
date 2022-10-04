
require('dotenv').config()
require('./mongo') // esto ejecuta todo el contenido del archivo mongo.js


const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./middleware/logger')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const Note = require('./models/Note')
const { request, response } = require('express')
const { handle } = require('express/lib/application')

app.use(express.json()) 
app.use(cors())
app.use(logger) 

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({})
        .then(notes => {
            response.json(notes)
        })
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id

    Note.findById(id).then(note =>{
        if(note){
            return response.json(note)
        }else{
            response.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id

    Note.findByIdAndRemove(id).then(result => {
        response.status(204).end()
    }).catch(err => {
        next(err)
    })

})


app.put('/api/notes/:id', (request, response, next) =>{
    const id = request.params.id
    const note = request.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
        .then(result =>{
            response.json(result)
        })

})

app.post('/api/notes', (request, response)=> {
    const note = request.body

    if(!note || !note.content){
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const newNote = new Note({
        content: note.content,
        important: note.important || false,
        date : new Date()
    })

    newNote.save().then(savedNote =>{
        response.status(201).json(savedNote)
    })

})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


