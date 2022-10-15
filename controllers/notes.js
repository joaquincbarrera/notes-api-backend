const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', (request, response) => {
    Note.find({}).populate('user',{
        name:1,
        _id:1
    })
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

notesRouter.post('/', async (request, response, next)=> {
    const { content, important = false, userId } = request.body

    const user = await User.findById(userId)

    if(!content){
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const newNote = new Note({
        content: content,
        important: important || false,
        date : new Date(),
        user : user._id
    })

    // newNote.save().then(savedNote =>{
    //     response.status(201).json(savedNote)
    // }).catch(error => next(error))

    try {
        const savedNote = await newNote.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()
        response.json(savedNote)
    } catch (error) {
        next(error)
    }
}) 

module.exports = notesRouter