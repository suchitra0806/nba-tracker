import type { Game } from '../api/nbaApi'

interface GameTableProps {
  games: Game[]
  loading: boolean
}

export function GameTable({ games, loading }: GameTableProps) {
  if (loading) {
    return (
      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400 shadow-card">
        Fetching recent games…
      </div>
    )
  }

  if (!games.length) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
        No games found for this window. Try expanding the date range or switching season.
      </div>
    )
  }

  return (
    <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 shadow-card backdrop-blur">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-100">Games snapshot</h2>
          <p className="text-xs text-slate-500">{games.length} games in current window</p>
        </div>
      </header>

      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full border-separate border-spacing-0 text-xs">
          <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
            <tr>
              <Th>Date</Th>
              <Th>Home</Th>
              <Th />
              <Th>Visitor</Th>
              <Th className="text-right">Total Pts</Th>
              <Th className="text-right pr-4">Margin</Th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              const date = new Date(game.date)
              const homeTotal = game.home_team_score
              const awayTotal = game.visitor_team_score
              const totalPoints = homeTotal + awayTotal
              const margin = Math.abs(homeTotal - awayTotal)
              const homeWon = homeTotal > awayTotal

              return (
                <tr
                  key={game.id}
                  className="group border-t border-slate-800/80 bg-slate-900/40 transition hover:bg-slate-900/80"
                >
                  <Td>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium">
                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {date.toLocaleDateString(undefined, { weekday: 'short', year: '2-digit' })}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <TeamCell
                      name={game.home_team.full_name}
                      abbr={game.home_team.abbreviation}
                      city={game.home_team.city}
                      score={homeTotal}
                      highlight={homeWon}
                    />
                  </Td>
                  <Td className="text-center text-[11px] text-slate-500">
                    <span className="rounded-full bg-slate-800/80 px-2 py-1">vs</span>
                  </Td>
                  <Td>
                    <TeamCell
                      name={game.visitor_team.full_name}
                      abbr={game.visitor_team.abbreviation}
                      city={game.visitor_team.city}
                      score={awayTotal}
                      highlight={!homeWon}
                      align="right"
                    />
                  </Td>
                  <Td className="text-right text-[11px] text-slate-100">{totalPoints}</Td>
                  <Td className="pr-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-[10px] text-slate-300">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          margin <= 5
                            ? 'bg-emerald-400'
                            : margin <= 12
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                        }`}
                      />
                      {margin === 0 ? 'Tied' : `${margin} pt`}
                    </span>
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`border-b border-slate-800 px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${className}`}
    >
      {children}
    </th>
  )
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-2 align-middle text-[11px] text-slate-200 ${className}`}>{children}</td>
}

interface TeamCellProps {
  name: string
  abbr: string
  city: string
  score: number
  highlight?: boolean
  align?: 'left' | 'right'
}

function TeamCell({ name, abbr, city, score, highlight, align = 'left' }: TeamCellProps) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-end text-right'
  const badgeAlignment = align === 'left' ? 'mr-2' : 'ml-2'

  return (
    <div className={`flex ${align === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center justify-between`}>
      <div className={`flex flex-1 flex-col ${alignment}`}>
        <div className="flex items-baseline gap-1">
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${badgeAlignment} bg-slate-900/90`}>
            {abbr}
          </span>
          <span className="text-[11px] font-medium text-slate-100">{name}</span>
        </div>
        <span className="text-[10px] text-slate-500">{city}</span>
      </div>
      <span
        className={`ml-2 inline-flex min-w-[36px] items-center justify-center rounded-lg px-2 py-1 text-[11px] font-semibold ${
          highlight ? 'bg-emerald-400 text-slate-950 shadow-card' : 'bg-slate-900 text-slate-200'
        }`}
      >
        {score}
      </span>
    </div>
  )
}

