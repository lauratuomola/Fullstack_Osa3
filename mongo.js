const mongoose = require('mongoose')

if ( process.env.MONGODB_URI !== 'production' ) {
    require('dotenv').config()
  }
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})
const person = new Person({
    name: process.argv.slice(2)[0],
    number: process.argv.slice(2)[1]
  })

if (person.name !== undefined){
  person
  .save()
  .then(response => {
    
    console.log(`Lisätään henkilö ${person.name} numero ${person.number} luetteloon`) 
    mongoose.connection.close()
  })} 
  else {
        console.log("puhelinluettelo:")

        Person
            .find({})
            .then(result => {
                result.forEach(person => {
                    console.log(person.name, person.number)
                })
        mongoose.connection.close()
  })}