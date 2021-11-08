import React from "react"

const Button = (props) => (
    <button onClick={props.HandleClick}>
      {props.text}
    </button>
)

export default Button