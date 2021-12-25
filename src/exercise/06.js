// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
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
        setState({...state, status: 'rejected', error: e})
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
      throw error
    default:
      throw new Error('Oops, reached an impossible and erroneous place.')
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <b>PokedexError:</b>{' '}
      <pre style={{whiteSpace: 'normal'}}>
        {error?.message || 'Oops. Something went wrong.'}
      </pre>
      <img src="/img/pokemon/sad_pikachu.jpg" alt="sad pikachu"></img>
    </div>
  )
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
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
