import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Layout } from './Layout'

describe('Layout', () => {
  it('renders the header and passed-in children', () => {
    render(
      <Layout>
        <p>dashboard content</p>
      </Layout>,
    )

    expect(screen.getByText('NBA Match Tracker')).toBeInTheDocument()
    expect(screen.getByText('dashboard content')).toBeInTheDocument()
  })
})
