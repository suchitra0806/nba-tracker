import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Layout } from './components/Layout'
import { Filters, type FiltersState } from './components/Filters'
import { GameTable } from './components/GameTable'
import { StatsSummary } from './components/StatsSummary'
import { GameTrendsChart } from './components/GameTrendsChart'
import { fetchGames, type Game } from './api/nbaApi'

const DEFAULT_FILTERS: FiltersState = {
  season: new Date().getFullYear(),
  daysBack: 7,
  team: '',
}

function App() {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced request parameters so rapid filter changes don't spam the API
  const [requestParams, setRequestParams] = useState({
    season: DEFAULT_FILTERS.season,
    daysBack: DEFAULT_FILTERS.daysBack,
  })

  // Simple in-memory cache for previous queries keyed by season + date range
  const cacheRef = useRef<Map<string, Game[]>>(new Map())

  useEffect(() => {
    const handle = setTimeout(() => {
      setRequestParams({
        season: filters.season,
        daysBack: filters.daysBack,
      })
    }, 500) // 500ms debounce

    return () => clearTimeout(handle)
  }, [filters.season, filters.daysBack])

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const today = new Date()
        const from = new Date(today)
        from.setDate(today.getDate() - requestParams.daysBack)

        const dates: string[] = []
        for (let d = new Date(from); d <= today; d.setDate(d.getDate() + 1)) {
          dates.push(d.toISOString().slice(0, 10))
        }

        const fromStr = from.toISOString().slice(0, 10)
        const toStr = today.toISOString().slice(0, 10)
        const cacheKey = `${requestParams.season}-${fromStr}-${toStr}`

        const cached = cacheRef.current.get(cacheKey)
        if (cached) {
          setGames(cached)
          return
        }

        const response = await fetchGames({
          dates,
          seasons: [requestParams.season],
          perPage: 80,
        })
        setGames(response.data)
        cacheRef.current.set(cacheKey, response.data)
      } catch (err) {
        console.error(err)

        if (axios.isAxiosError(err)) {
          const status = err.response?.status

          if (status === 429) {
            setError('You have hit the free API rate limit. Wait a bit and try again, or adjust filters less frequently.')
          } else if (status === 401 || status === 403) {
            setError('Authentication with the NBA API failed. Check that your API key is set correctly in .env.')
          } else if (status && status >= 500) {
            setError('The NBA data service is having issues (server error). Please try again in a few minutes.')
          } else {
            setError('Unable to load games right now. Please check your connection and try again.')
          }
        } else {
          setError('Something unexpected went wrong while loading games.')
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [requestParams.daysBack, requestParams.season])

  const filteredGames = useMemo(() => {
    if (!filters.team.trim()) return games

    const query = filters.team.toLowerCase()
    return games.filter((g) => {
      const fields = [
        g.home_team.full_name,
        g.home_team.abbreviation,
        g.home_team.city,
        g.visitor_team.full_name,
        g.visitor_team.abbreviation,
        g.visitor_team.city,
      ]
      return fields.some((field) => field.toLowerCase().includes(query))
    })
  }, [games, filters.team])

  return (
    <Layout>
      <Filters value={filters} onChange={setFilters} />

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-950/50 px-4 py-3 text-xs text-rose-100">
          {error}
        </div>
      )}

      <StatsSummary games={filteredGames} />
      <GameTrendsChart games={filteredGames} />
      <GameTable games={filteredGames} loading={loading} />
    </Layout>
  )
}

export default App
