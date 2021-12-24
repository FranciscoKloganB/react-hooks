// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)

  // 🐨 use React.useEffect where the callback should be called whenever the pokemon name changes.
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    // Prevents error from being returned and guarantees "submit a pokemon" message displayed when needed
    setError(null)
    setPokemon(null)

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
      })
      .catch(e => {
        setError(e.message)
        console.log('Error when fetching pokemon data with GraphQL', e)
      })
  }, [pokemonName])

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  if (error) {
    return (
      <div role="alert">
        PokedexError: <pre style={{whiteSpace: 'normal'}}>{error}</pre>
        <img src="/img/pokemon/sad_pikachu.jpg" alt="sad pikachu"></img>
      </div>
    )
  }

  if (!pokemonName) {
    return 'Submit a pokemon'
  }

  if (!pokemon) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
