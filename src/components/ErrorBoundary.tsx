import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error in dashboard:', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-4 text-center text-slate-100">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="text-sm text-slate-400">
            The dashboard hit an unexpected error and couldn&apos;t continue rendering.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-xl bg-accent-primary px-4 py-2 text-sm font-medium text-slate-950 shadow-card"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
