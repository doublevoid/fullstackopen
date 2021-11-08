import React from 'react'

const Header = (props) =>{
  console.log(props.course)
  return <>{props.course.name}</>
}

const Part = (props) =>{
  console.log(props)
  return(
  <li>{props.name} {props.exercises}</li>
  )
}

const Content = (props) => {
  console.log(props)
  return(
  <ul>
    {props.course.parts.map(part =>
      <Part key={part.id} name={part.name} exercises={part.exercises}/>)}
  </ul>
  )
}

const Total = (props) =>{
  console.log(props)
  const parts = props.course.parts.map(part => part.exercises)
  return(
    parts.reduce((p, s) => p +s)
  )
}

const Course = (props) => {
  console.log(props.course)
  return (
    <div>
      <strong><Header course={props.course}/></strong>
      <Content course={props.course}/>
      <Total course={props.course}/>
    </div>
  )
}

export default Course