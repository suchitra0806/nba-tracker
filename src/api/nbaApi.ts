import axios from 'axios'

const BASE_URL = 'https://api.balldontlie.io/v1'

// If you get an API key, expose it via Vite env (VITE_NBA_API_KEY)
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: import.meta.env.VITE_NBA_API_KEY ? `Bearer ${import.meta.env.VITE_NBA_API_KEY}` : '',
  },
})

export interface Team {
  id: number
  full_name: string
  abbreviation: string
  city: string
}

export interface Game {
  id: number
  date: string
  home_team: Team
  visitor_team: Team
  home_team_score: number
  visitor_team_score: number
  season: number
}

export interface PagedResponse<T> {
  data: T[]
  meta: {
    total_pages: number
    current_page: number
    next_page: number | null
    per_page: number
    total_count: number
  }
}

export interface GamesFilter {
  dates?: string[]
  teamIds?: number[]
  seasons?: number[]
  perPage?: number
}

export async function fetchGames(filter: GamesFilter): Promise<PagedResponse<Game>> {
  const params: Record<string, string | number | (string | number)[]> = {
    per_page: filter.perPage ?? 50,
  }

  if (filter.dates?.length) params.dates = filter.dates
  if (filter.seasons?.length) params.seasons = filter.seasons
  if (filter.teamIds?.length) params['team_ids[]'] = filter.teamIds.map(String)

  const { data } = await api.get<PagedResponse<Game>>('/games', { params })
  return data
}
