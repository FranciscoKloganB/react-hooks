import * as React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state to error so the next render will show the fallback UI.
    // Using shorthand for { error: error} (key becomes 'error' and value is whatever is within error arg)
    return {error}
  }

  componentDidCatch(error, errorInfo) {
    // Log error locally or on remote service
    console.log('Pokemon Error Boundary hit by error', error, errorInfo)
  }

  render() {
    const {error} = this.state
    if (error) {
      return (
        <div role="alert">
          <this.props.FallbackComponent error={error}/>
        </div>
      )
    }

    return this.props.children
  }
}
