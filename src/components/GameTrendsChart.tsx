import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import type { Game } from '../api/nbaApi'

interface GameTrendsChartProps {
  games: Game[]
}

export function GameTrendsChart({ games }: GameTrendsChartProps) {
  if (!games.length) return null

  const data = games
    .map((game) => {
      const total = game.home_team_score + game.visitor_team_score
      const margin = Math.abs(game.home_team_score - game.visitor_team_score)
      return {
        id: game.id,
        date: new Date(game.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        total,
        margin,
      }
    })
    .sort((a, b) => (a.date > b.date ? 1 : -1))

  return (
    <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-card backdrop-blur">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-100">Scoring & margin trends</h2>
          <p className="text-xs text-slate-500">Hover to inspect each game&apos;s scoring profile.</p>
        </div>
      </header>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                border: '1px solid #1e293b',
                borderRadius: 12,
                padding: 12,
                fontSize: 11,
              }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}
              formatter={(value: unknown, name: string) => {
                if (name === 'total') return [`${value} pts`, 'Total points']
                if (name === 'margin') return [`${value} pts`, 'Margin']
                return [String(value), name]
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="url(#colorTotal)"
              yAxisId="left"
              name="total"
            />
            <Area
              type="monotone"
              dataKey="margin"
              stroke="#a855f7"
              strokeWidth={1.8}
              fill="url(#colorMargin)"
              yAxisId="right"
              name="margin"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

