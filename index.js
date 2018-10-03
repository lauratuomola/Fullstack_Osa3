const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan= require('morgan')
const cors = require('cors')
const Person = require('./models/note')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(express.static('build'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }

]

const formatPerson = (person) => {
    return {
      name: person.name,
      number: person.number,
      id: person._id
    }
  }

app.get('/info', (request, response) => {
    const yht = persons.length
    const pvm = new Date()
    const tiedot = `<p>Puhelinluettelossa ${yht} henkilön tiedot</p><br></br>${pvm}`
    response.send(tiedot)
})
app.get('/api/persons/:id', (request, response) => {
   Person
        .findById(request.params.id)
        .then (person => {
            response.json(formatPerson(person))
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
        return response.status(400).json({ error: 'name missing' })
      }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
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
    person.save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})