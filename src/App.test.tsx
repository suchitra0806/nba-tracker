import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { fetchGames, type Game, type PagedResponse } from './api/nbaApi'

vi.mock('./api/nbaApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./api/nbaApi')>()
  return { ...actual, fetchGames: vi.fn() }
})

const mockedFetchGames = vi.mocked(fetchGames)

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

function page(data: Game[]): PagedResponse<Game> {
  return {
    data,
    meta: { total_pages: 1, current_page: 1, next_page: null, per_page: data.length, total_count: data.length },
  }
}

describe('App request race handling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockedFetchGames.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the latest request result even when an older request resolves after it', async () => {
    let resolveStale!: (value: PagedResponse<Game>) => void
    let resolveFresh!: (value: PagedResponse<Game>) => void

    const stalePromise = new Promise<PagedResponse<Game>>((resolve) => {
      resolveStale = resolve
    })
    const freshPromise = new Promise<PagedResponse<Game>>((resolve) => {
      resolveFresh = resolve
    })

    mockedFetchGames.mockReturnValueOnce(stalePromise).mockReturnValueOnce(freshPromise)

    render(<App />)

    // Flush the initial debounce so the first ("stale") request fires.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(mockedFetchGames).toHaveBeenCalledTimes(1)

    // Trigger a second ("fresh") request before the first resolves.
    fireEvent.click(screen.getByRole('button', { name: 'Last 14 days' }))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(mockedFetchGames).toHaveBeenCalledTimes(2)

    // Resolve out of arrival order: fresh first, stale after.
    await act(async () => {
      resolveFresh(page([makeGame(2, 132, 90)]))
      await vi.advanceTimersByTimeAsync(0)
    })
    await act(async () => {
      resolveStale(page([makeGame(1, 61, 58)]))
      await vi.advanceTimersByTimeAsync(0)
    })

    // Fresh game: 132-90 -> "42 pt" margin badge. Stale game: 61-58 -> "3 pt".
    expect(screen.getByText('42 pt')).toBeInTheDocument()
    expect(screen.queryByText('3 pt')).not.toBeInTheDocument()
  })
})
