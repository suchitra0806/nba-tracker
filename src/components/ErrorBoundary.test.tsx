import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('boom')
  return <p>rendered fine</p>
}

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText('rendered fine')).toBeInTheDocument()
  })

  it('renders a fallback instead of blanking the page when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.queryByText('rendered fine')).not.toBeInTheDocument()

    vi.restoreAllMocks()
  })

  it('lets the user retry after an error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    let shouldThrow = true
    function Toggle() {
      return <Bomb shouldThrow={shouldThrow} />
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Toggle />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    rerender(
      <ErrorBoundary>
        <Toggle />
      </ErrorBoundary>,
    )

    expect(screen.getByText('rendered fine')).toBeInTheDocument()

    vi.restoreAllMocks()
  })
})
