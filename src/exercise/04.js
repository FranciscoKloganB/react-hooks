// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

import {useLocalStorageState} from './hooks/useLocalStorageState'

const getEmptyBoard = () => Array(9).fill(null)

// 3. 💯 Create a full backward and forward compatible history
function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function BoardHistory({history, currentStep, setCurrentStep}) {
  return history.map((stepSquares, step) => {
    const description = step === 0 ? 'Go to start of game' : `Go to snapshot #${step}`
    const isCurrentStep = step === currentStep

    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {description}
          {isCurrentStep ? ' [current]' : ''}
        </button>
      </li>
    )
  })
}

function Game() {
  const [squares, setSquares] = useLocalStorageState('tic-tac-toe', getEmptyBoard())
  const [currentStep, setCurrentStep] = useLocalStorageState('tic-tac-tie', 0)

  const boardHistory = [[], squares, []]

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  const selectSquare = square => {
    if (winner || squares[square]) {
      return squares
    }

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
  }

  function restart() {
    setSquares(getEmptyBoard())
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          <BoardHistory history={boardHistory} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  const noVictoryStatus = squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
  return winner ? `Winner: ${winner}` : noVictoryStatus
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
