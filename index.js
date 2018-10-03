const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan= require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))


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
app.get('/info', (request, response) => {
    const yht = persons.length
    const pvm = new Date()
    const tiedot = `<p>Puhelinluettelossa ${yht} henkilön tiedot</p><br></br>${pvm}`
    response.send(tiedot)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person= persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})
app.get('/api/persons', (request, response) => {
    response.send(persons)
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
app.post('/api/persons', (request,response) => {
    const body = request.body
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
      }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
      }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 100)
      }

    const names = persons.map(nimi => nimi.name)

    if (names.includes(person.name)){
        return response.status(400).json({ error: 'name must be unique' })
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})