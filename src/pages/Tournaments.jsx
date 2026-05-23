import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function useCountdown(targetDate) {
  const [diff, setDiff] = useState(() =>
    targetDate ? new Date(targetDate).getTime() - Date.now() : 0
  )

  useEffect(() => {
    if (!targetDate) return
    const id = setInterval(() => {
      setDiff(new Date(targetDate).getTime() - Date.now())
    }, 60_000)
    return () => clearInterval(id)
  }, [targetDate])

  return {
    days:  Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0),
    hours: Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0),
    mins:  Math.max(Math.floor((diff / (1000 * 60)) % 60), 0),
  }
}

export default function Tournaments() {
  const [tournament, setTournament] = useState(null)
  const [matches, setMatches]       = useState([])

  useEffect(() => { fetchTournament() }, [])

  async function fetchTournament() {
    const { data: tournamentData } = await supabase
      .from('tournaments')
      .select('*')
      .limit(1)
      .single()

    setTournament(tournamentData)
    if (!tournamentData) return

    const { data: matchData } = await supabase
      .from('tournament_matches')
      .select('*')
      .eq('tournament_id', tournamentData.id)

    setMatches(matchData || [])
  }

  const { days, hours, mins } = useCountdown(tournament?.tournament_date)

  const dateLabel = tournament?.tournament_date
    ? new Date(tournament.tournament_date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
      })
    : '24 Mai • 18:00 CET'

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            text-4xl sm:text-5xl lg:text-6xl
            font-black
            bg-gradient-to-r from-cyan-300 via-slate-100 to-amber-300
            bg-clip-text text-transparent
          "
        >
          TOURNOIS
        </motion.h1>
        <p className="text-white/60 mt-3 text-lg">Blitz Mensuelle</p>
      </div>

      {/* COUNTDOWN */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          relative overflow-hidden
          rounded-3xl border border-white/10
          bg-gradient-to-br from-[#151d35] to-[#0b1120]
          p-8
        "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10" />

        <div className="relative z-10">
          <div className="text-white/50 text-sm uppercase tracking-widest mb-5">
            Prochain Tournoi
          </div>

          <div className="flex gap-8">
            {[
              { value: days,  label: 'Jours'  },
              { value: hours, label: 'Heures' },
              { value: mins,  label: 'Min'    },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-5xl sm:text-6xl font-black text-cyan-400 tabular-nums">
                  {String(value).padStart(2, '0')}
                </div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-2">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-white/60 text-sm">
            {dateLabel}
          </div>
        </div>
      </motion.div>

      {/* MATCHES TABLE */}
      {matches.length > 0 ? (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0b1120]/80 backdrop-blur-xl">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-cyan-500/5">
                {['Round', 'Player 1', 'Score', 'Player 2', 'Winner', 'Status'].map(h => (
                  <th key={h} className="p-5 text-cyan-300 font-bold text-sm uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <motion.tr
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-5">
                    <span className="inline-flex px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-bold">
                      {match.round}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                      <span className="font-semibold">{match.player1}</span>
                    </div>
                  </td>
                  <td className="p-5 text-xl font-black text-cyan-300">
                    {match.score1} – {match.score2}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
                      <span className="font-semibold">{match.player2}</span>
                    </div>
                  </td>
                  <td className="p-5 text-green-400 font-bold">
                    {match.winner || 'TBD'}
                  </td>
                  <td className="p-5">
                    <span className="inline-flex px-3 py-1 rounded-full bg-cyan-400/10 border border-white/10 text-cyan-300 text-xs font-bold">
                      LIVE
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 text-white/30 text-lg">
          Aucun match pour ce tournoi.
        </div>
      )}

    </div>
  )
}