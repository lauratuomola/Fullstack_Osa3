const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan= require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

app.use(bodyParser.json())
morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :response-time :body'))

app.use(express.static('build'))
app.use(cors())


const formatPerson = (person) => {
    return {
      name: person.name,
      number: person.number,
      id: person._id
    }
  }

  app.get('/info', (request, response) => {
    Person
      .find({})
      .then(result => {
        const text = `puhelinluettelossa ${result.length} henkilön tiedot<br/>${new Date()}`
        response.send(text)
      })
  
  })
app.get('/api/persons/:id', (request, response) => {
   Person
        .findById(request.params.id)
        .then (person => {
            if (person) {
                response.json(formatPerson(person))
            } else {
                response.status(404).end()
            }
        })
})

app.get('/api/persons', (request, response) => {
    Person
    .find({})
    .then(persons => {
      response.json(persons.map(formatPerson))
    })
})
app.delete('/api/persons/:id', (request, response) => {
    Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
  })
app.post('/api/persons', (request,response) => {
    const body = request.body
   
    if (body.name === undefined) {
        return response.status(404).json({ error: 'name missing' })
      }
    if (body.number === undefined) {
        return response.status(404).json({ error: 'number missing' })
      }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 100)
      })

    const names = persons.map(nimi => nimi.name)

    if (names.includes(person.name)){
        return response.status(400).json({ error: 'name must be unique' })
    }
    if (body.name !== undefined && body.number !== undefined) {
        person.save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})