// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null
  })

  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({...state, status: 'pending'})

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({...state, status: 'resolved', pokemon: pokemonData})
      })
      .catch(e => {
        setState({...state, status: 'rejected', error: e.message})
        console.log('Error when fetching pokemon data with GraphQL', e)
      })
    // false positive exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
