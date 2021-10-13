import React, { useState } from 'react'

const StatisticLine = (props) => {
  return(<td>{props.text} {props.value}</td>)
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => (
  <div>
    <strong>Statistics:</strong><br />
    <table>
      <tbody>
        <tr><StatisticLine text="good" value={props.good} /></tr>
        <tr><StatisticLine text="neutral" value={props.neutral} /></tr>
        <tr><StatisticLine text="bad" value={props.bad} /></tr>
        <tr><StatisticLine text="all" value={props.all} /></tr>
        <tr><StatisticLine text="average" value={(props.good - props.bad) / props.all} /></tr>
        <tr><StatisticLine text="percentage" value={(props.good / props.all * 100)} /></tr>
      </tbody>
    </table>
  </div>
)

const Feedback = (props) => {
  if (props.all === 0) {
    return (
      <div>
        No feedback yet.
      </div>
    )
  }
  return (
    <Statistics good={props.good} neutral={props.neutral} bad={props.bad} all={props.all} />
  )
}


// const setToValue = (newValue) => {
//   setValue(newValue)
// }

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(all + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(all + 1)
  }



  return (
    <div>
      <div>
        <strong>Give feedback:</strong>
        <div>
          <Button handleClick={handleGoodClick} text='good' />
          <Button handleClick={handleNeutralClick} text='neutral' />
          <Button handleClick={handleBadClick} text='bad' />
        </div>
      </div>
      <Feedback good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  )
}

export default App