// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// 4. 💯 flexible localStorage hook - use json stringify and parse to accept any 'value' in our custom hook
// useLocalStorageState now receives a serializer and deserializer, by default it is the JavaScript JSON streamhandler,
// allowing to store arbitrary data on the browser
function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {}, // This line of code appears not to work in firefox, but does in chrome
) {
  const [value, setValue] = React.useState(() => {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue) {
      return deserialize(storedValue)
    }

    // Allows default value that is given to this custom hook to be a function a variable
    // This can be good particularly good for many reasons, including avoiding hard computations if an anonymous function is passed
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  // Creates a reactive variable pointing to the provided localStorage key
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {

    // If on render t+n > t, the localStorage key passed to this hook instances changes, we remove the old key from local storage
    const prevKey = prevKeyRef.current
    if (prevKeyRef !== key) {
      window.localStorage.removeItem(prevKey)
    }

    prevKeyRef.current = key

    window.localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  // const [name, setName] = React.useState(
  //   window.localStorage.getItem('name') || initialName,
  // )
  // 1. 💯 Use lazy state initialization to avoid reading from local storage after the component is first rendered
  // const [name, setName] = React.useState(() => window.localStorage.getItem('name') || initialName)

  // 🐨 Here's where you'll use `React.useEffect`. The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name)
  // })
  // 2. 💯  Use the useEffect dependencies argument to ensure that useEffect only stores `name` to local storage
  // when the value of `name` is updated and not when a parent re-renders.
  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name)
  // }, [name])

  // 3. 💯 custom hook - Remaining DRY and clean is important. Define a custom hook, that is invoked
  // by useEffect within this component, but could be used in another components requiring similar behaviours.
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  function handleFormSubmit(event) {
    event.preventDefault()
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Francisco Barros" />
}

export default App
