import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchAllGames, type Game, type PagedResponse } from './nbaApi'

const { get } = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('axios', () => ({
  default: {
    create: () => ({ get }),
    isAxiosError: () => false,
  },
}))

function makeGame(id: number): Game {
  return {
    id,
    date: '2026-01-01',
    home_team: { id: 1, full_name: 'Home Team', abbreviation: 'HOM', city: 'Home' },
    visitor_team: { id: 2, full_name: 'Visitor Team', abbreviation: 'VIS', city: 'Visitor' },
    home_team_score: 100,
    visitor_team_score: 90,
    season: 2025,
  }
}

function page(data: Game[], nextPage: number | null, currentPage: number): PagedResponse<Game> {
  return {
    data,
    meta: {
      total_pages: nextPage ? currentPage + 1 : currentPage,
      current_page: currentPage,
      next_page: nextPage,
      per_page: data.length,
      total_count: data.length,
    },
  }
}

describe('fetchAllGames', () => {
  afterEach(() => {
    get.mockReset()
  })

  it('aggregates every page until next_page is null', async () => {
    get
      .mockResolvedValueOnce({ data: page([makeGame(1), makeGame(2)], 2, 1) })
      .mockResolvedValueOnce({ data: page([makeGame(3)], 3, 2) })
      .mockResolvedValueOnce({ data: page([], null, 3) })

    const games = await fetchAllGames({ seasons: [2025] })

    expect(games.map((g) => g.id)).toEqual([1, 2, 3])
    expect(get).toHaveBeenCalledTimes(3)
  })

  it('stops after a single page when next_page is already null', async () => {
    get.mockResolvedValueOnce({ data: page([makeGame(1)], null, 1) })

    const games = await fetchAllGames({ seasons: [2025] })

    expect(games).toHaveLength(1)
    expect(get).toHaveBeenCalledTimes(1)
  })
})
