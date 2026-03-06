import { useMemo } from 'react'

const currentYear = new Date().getFullYear()
const recentSeasons = Array.from({ length: 5 }, (_, i) => currentYear - i)

export interface FiltersState {
  season: number
  daysBack: number
  team: string
}

interface FiltersProps {
  value: FiltersState
  onChange: (value: FiltersState) => void
}

const dayOptions = [
  { label: 'Last 3 days', value: 3 },
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 14 days', value: 14 },
  { label: 'Last 30 days', value: 30 },
]

export function Filters({ value, onChange }: FiltersProps) {
  const seasonOptions = useMemo(
    () =>
      recentSeasons.map((season) => ({
        label: `${season}–${String(season + 1).slice(-2)}`,
        value: season,
      })),
    [],
  )

  return (
    <section className="mb-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-card backdrop-blur sm:grid-cols-3">
      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Season</label>
        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition hover:border-accent-primary/60 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
          value={value.season}
          onChange={(e) => onChange({ ...value, season: Number(e.target.value) })}
        >
          {seasonOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Window</label>
        <div className="flex gap-2">
          {dayOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ ...value, daysBack: option.value })}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium transition ${
                value.daysBack === option.value
                  ? 'bg-accent-primary text-slate-950 shadow-card'
                  : 'border border-slate-700/80 bg-slate-900/40 text-slate-300 hover:border-accent-primary/60 hover:text-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Team filter (optional)</label>
        <input
          type="text"
          placeholder="e.g. Lakers, BOS, Curry"
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition hover:border-accent-secondary/60 focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/30"
          value={value.team}
          onChange={(e) => onChange({ ...value, team: e.target.value })}
        />
        <p className="text-[10px] text-slate-500">
          Filters by team name, city, or abbreviation on the visible games.
        </p>
      </div>
    </section>
  )
}

