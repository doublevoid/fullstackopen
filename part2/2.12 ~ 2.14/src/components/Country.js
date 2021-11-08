import React from "react"
import Button from "./Button"

const Country = ({ country, func }) =>{
    return(
        <li>{country.name.common} <button onClick={() => func(country)}> show </button></li>
    )
}

export default Country