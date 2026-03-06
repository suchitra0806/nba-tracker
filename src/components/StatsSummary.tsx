import type { Game } from '../api/nbaApi'

interface StatsSummaryProps {
  games: Game[]
}

export function StatsSummary({ games }: StatsSummaryProps) {
  if (!games.length) return null

  const totals = games.reduce(
    (acc, game) => {
      const home = game.home_team_score
      const away = game.visitor_team_score
      const sum = home + away
      const margin = Math.abs(home - away)

      acc.totalPoints += sum
      acc.maxPoints = Math.max(acc.maxPoints, sum)
      acc.minPoints = Math.min(acc.minPoints, sum)
      acc.closeGames += margin <= 5 ? 1 : 0
      acc.blowouts += margin >= 15 ? 1 : 0

      return acc
    },
    {
      totalPoints: 0,
      maxPoints: 0,
      minPoints: Number.POSITIVE_INFINITY,
      closeGames: 0,
      blowouts: 0,
    },
  )

  const avgPoints = Math.round(totals.totalPoints / games.length)

  const metrics = [
    {
      label: 'Avg combined points',
      value: avgPoints,
      chip: 'pace & scoring',
    },
    {
      label: 'Highest total in window',
      value: totals.maxPoints,
      chip: 'peak offense',
    },
    {
      label: 'Low-scoring outlier',
      value: totals.minPoints === Number.POSITIVE_INFINITY ? '—' : totals.minPoints,
      chip: 'defensive grind',
    },
    {
      label: 'Close games (≤ 5 pts)',
      value: totals.closeGames,
      chip: 'clutch factor',
    },
    {
      label: 'Blowouts (≥ 15 pts)',
      value: totals.blowouts,
      chip: 'one-sided',
    },
  ]

  return (
    <section className="mb-4 grid gap-3 sm:grid-cols-3 md:grid-cols-5">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3 shadow-card"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-primary/10 via-transparent to-accent-secondary/10 opacity-60" />
          <div className="relative space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{metric.label}</p>
            <p className="text-xl font-semibold text-slate-50">{metric.value}</p>
            <span className="inline-flex items-center rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] text-slate-300">
              {metric.chip}
            </span>
          </div>
        </article>
      ))}
    </section>
  )
}

