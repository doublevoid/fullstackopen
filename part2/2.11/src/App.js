import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Person from './components/Person'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    console.log('effect')
    axios.get('http://localhost:3001/persons').then(response => {
        console.log('promise fulfilled')
        console.log(response.data)
        setPersons(response.data)
    })
  }, [])

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