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
  const [filteredNumbers, setNewFilter] = useState([])

  const baseUrl = 'http://localhost:3001/persons'

  useEffect(() => {
    console.log('effect')
    axios.get(baseUrl).then(response => {
        console.log('promise fulfilled')
        console.log(response.data)
        setPersons(response.data)
        setNewFilter(response.data)
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
    if (event.target.value === ''){
      setNewFilter(persons)
      return
    }
    else{
      setNewFilter(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
    }
      
  }

  const removePerson = id => {
    let newUrl = baseUrl + '/' + id
    const pRemoved = persons.find(p => p.id === id)
    console.log(pRemoved)
    if (window.confirm("Do you really want to leave?")) {
      axios.delete(newUrl, {params: {pRemoved}})
      .then(response =>{
        setPersons(persons.filter(person => person.id !== id))
        setNewSearch('')
        setNewFilter(persons.filter(person => person.id !== id))
      })
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
      axios.post(baseUrl, personObject)
      .then(response =>{
        setPersons(persons.concat(response.data))
        setNewSearch('')
        setNewFilter(persons.concat(response.data))
      })

    }

  }

  return (
    <div>
        <Filter value={newSearch} onChange={handleSearchChange} />
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} onSubmit={addPerson}/>
      <ul>
        {filteredNumbers.map(person =>
          <Person key={person.name} name={person.name} number={person.number} deletePerson={() => removePerson(person.id)}/>
          )}
      </ul>
    </div>
  )
}

export default App