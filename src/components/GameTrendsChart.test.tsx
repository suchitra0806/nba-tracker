import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameTrendsChart } from './GameTrendsChart'
import type { Game } from '../api/nbaApi'

function makeGame(id: number, homeScore: number, visitorScore: number): Game {
  return {
    id,
    date: '2026-01-01',
    home_team: { id: 1, full_name: 'Home Team', abbreviation: 'HOM', city: 'Home' },
    visitor_team: { id: 2, full_name: 'Visitor Team', abbreviation: 'VIS', city: 'Visitor' },
    home_team_score: homeScore,
    visitor_team_score: visitorScore,
    season: 2025,
  }
}

describe('GameTrendsChart loading indication', () => {
  const games = [makeGame(1, 100, 90)]

  it('does not show a refreshing indicator when not loading', () => {
    render(<GameTrendsChart games={games} loading={false} />)

    expect(screen.queryByText('Refreshing…')).not.toBeInTheDocument()
    const section = screen.getByText('Scoring & margin trends').closest('section')
    expect(section).toHaveAttribute('aria-busy', 'false')
  })

  it('shows a refreshing indicator and dims the chart while loading', () => {
    render(<GameTrendsChart games={games} loading={true} />)

    expect(screen.getByText('Refreshing…')).toBeInTheDocument()
    const section = screen.getByText('Scoring & margin trends').closest('section')
    expect(section).toHaveAttribute('aria-busy', 'true')
    expect(section?.className).toContain('opacity-50')
  })
})
