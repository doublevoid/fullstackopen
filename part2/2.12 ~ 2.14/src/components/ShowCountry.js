import React from "react"

const ShowCountry = ({ country }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            capital {country.capital}<br />
            region {country.region}
            <h1 key={country.languages}>languages</h1>
            <ul>
                {Object.entries(country.languages).map(([key, val]) =>
                    <li key={key}>
                        {val}
                    </li>)}
            </ul>
            <img src={country.flags.png} alt="help"></img>
        </div>
    )

}

export default ShowCountry