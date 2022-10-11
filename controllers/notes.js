const notesRouter = require('express').Router()

const Note = require('../models/Note')


notesRouter.get('/', (request, response) => {
    Note.find({})
        .then(notes => {
            response.json(notes)
        })
})

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id

    Note.findByIdAndRemove(id).then(result => {
        response.status(204).end()
    }).catch(err => {
        next(err)
    })

})


notesRouter.put('/:id', (request, response, next) =>{
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

notesRouter.post('/', (request, response)=> {
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

module.exports = notesRouter