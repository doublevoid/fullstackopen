import React, { useState } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Person from './components/Person'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const handleNameChange = (event) => {

    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) =>{
    setNewSearch(event.target.value)

    const person = persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    if (persons.length !== 0){
      setPersons(person)
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.filter(person => person.name === newName)
    if (parseInt(person.length) > 0) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      setPersons(persons.concat(personObject))

    }

  }

  return (
    <div>
        <Filter value={newSearch} onChange={handleSearchChange} />
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} onSubmit={addPerson}/>
      <ul>
        {persons.map(person =>
          <Person key={person.name} name={person.name} number={person.number}/>
          )}
      </ul>
    </div>
  )
}

export default App