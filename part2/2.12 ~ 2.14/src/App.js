import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'
import Filter from './components/Filter'
import Language from './components/Language'
import ShowCountry from './components/ShowCountry'



const History = ({ countries, func }) => {
  if (countries.length > 10 | countries[0] === undefined) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  if (countries.length === 1) {
    return (
      <div>
        <ShowCountry key={countries[0].name.common} country={countries[0]} />
      </div>
    )
  }
  return (
    <ul>
      {countries.map(country => {
        return (<Country key={country.name.common} country={country} func={func}/>)})}
    </ul>
  )
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')
  const [filteredCountries, setNewFilter] = useState([])

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
    setNewFilter(countries.filter(country => country.name.common.toLowerCase().includes(newSearch.toLowerCase())))
    console.log(filteredCountries)
  }

  const handleShowCountry= (bito) => {
    let countryList = []
    countryList.push(bito)
    setNewFilter(countryList)
  }

  

  return (
    <div>
      <h1>Countries</h1>
      <Filter value={newSearch} onChange={handleSearchChange} />
      <History countries={filteredCountries} func={handleShowCountry}/>
    </div>
  )

}



export default App