import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { fetchAllGames, type Game } from './api/nbaApi'

vi.mock('./api/nbaApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./api/nbaApi')>()
  return { ...actual, fetchAllGames: vi.fn() }
})

const mockedFetchAllGames = vi.mocked(fetchAllGames)

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

describe('App request race handling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockedFetchAllGames.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the latest request result even when an older request resolves after it', async () => {
    let resolveStale!: (value: Game[]) => void
    let resolveFresh!: (value: Game[]) => void

    const stalePromise = new Promise<Game[]>((resolve) => {
      resolveStale = resolve
    })
    const freshPromise = new Promise<Game[]>((resolve) => {
      resolveFresh = resolve
    })

    mockedFetchAllGames.mockReturnValueOnce(stalePromise).mockReturnValueOnce(freshPromise)

    render(<App />)

    // Flush the initial debounce so the first ("stale") request fires.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(mockedFetchAllGames).toHaveBeenCalledTimes(1)

    // Trigger a second ("fresh") request before the first resolves.
    fireEvent.click(screen.getByRole('button', { name: 'Last 14 days' }))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(mockedFetchAllGames).toHaveBeenCalledTimes(2)

    // Resolve out of arrival order: fresh first, stale after.
    await act(async () => {
      resolveFresh([makeGame(2, 132, 90)])
      await vi.advanceTimersByTimeAsync(0)
    })
    await act(async () => {
      resolveStale([makeGame(1, 61, 58)])
      await vi.advanceTimersByTimeAsync(0)
    })

    // Fresh game: 132-90 -> "42 pt" margin badge. Stale game: 61-58 -> "3 pt".
    expect(screen.getByText('42 pt')).toBeInTheDocument()
    expect(screen.queryByText('3 pt')).not.toBeInTheDocument()
  })
})
