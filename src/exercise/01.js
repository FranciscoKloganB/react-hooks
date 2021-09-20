// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

import PropTypes from 'prop-types'; // ES6

function Greeting({initialName = ''}) {
  // 💣 delete this variable declaration and replace it with a React.useState call
  const [name, setName] = React.useState(initialName)

  function handleNameChange(event) {
    // 🐨 update the name here based on event.target.value
    setName(event.target.value)
  }

  function handleFormSubmit(event) {
    event.preventDefault()
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name">Name: </label>
        <input id="name" value={name} onChange={handleNameChange} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

Greeting.propTypes = {
  initialName: PropTypes.string
}

function App() {
  return <Greeting initialName={"Francisco Barros"} />
}

export default App
