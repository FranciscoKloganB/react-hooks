import * as React from 'react'

// 4. 💯 flexible localStorage hook - use json stringify and parse to accept any 'value' in our custom hook
// useLocalStorageState now receives a serializer and deserializer, by default it is the JavaScript JSON streamhandler,
// allowing to store arbitrary data on the browser
export function useLocalStorageState(
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
