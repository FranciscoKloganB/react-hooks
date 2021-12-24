// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [status, setStatus] = React.useState('idle')
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setStatus('pending')

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
        setStatus('resolved')
      })
      .catch(e => {
        setError(e.message)
        setStatus('rejected')
        console.log('Error when fetching pokemon data with GraphQL', e)
      })
  }, [pokemonName])

  switch (status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      return (
        <div role="alert">
          PokedexError: <pre style={{whiteSpace: 'normal'}}>{error}</pre>
          <img src="/img/pokemon/sad_pikachu.jpg" alt="sad pikachu"></img>
        </div>
      )
    default:
      throw Error('Impossible status has been reached.')
  }
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
