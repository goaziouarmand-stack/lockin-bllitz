import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { supabase } from '../lib/supabase'
import AnimatedAvatar from '../components/ui/AnimatedAvatar'
import RankBadge from '../components/ui/RankBadge'
import EloChart from '../components/ui/EloChart'

export default function PlayerProfile() {
  const { username } = useParams()
  const [player, setPlayer] = useState(null)
  const [matches, setMatches] = useState([])

  useEffect(() => {
    fetchPlayer()
    fetchMatches()
  }, [])

  async function fetchPlayer() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('username', username)
      .single()
    setPlayer(data)
  }

  async function fetchMatches() {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .or(`player1.eq.${username},player2.eq.${username}`)
      .order('created_at', { ascending: false })
    setMatches(data || [])
  }

  function getWinrate() {
    if (!player) return 0
    const total = player.wins + player.losses
    if (total === 0) return 0
    return Math.round((player.wins / total) * 100)
  }

  if (!player) {
    return <div className="text-center p-20 text-white/50">Chargement...</div>
  }

  return (
    <div className="space-y-8">

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative overflow-hidden
          rounded-3xl border border-purple-500/20
          bg-gradient-to-br from-[#151d35] to-[#0a1020]
          p-10
        "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <AnimatedAvatar username={player.username} rank={1} />
            <div>
              <h1 className="
                text-5xl font-black
                bg-gradient-to-r from-purple-400 to-cyan-400
                bg-clip-text text-transparent
              ">
                {player.username}
              </h1>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <RankBadge elo={player.elo} size="lg" />
                <div className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 font-bold">
                  {player.elo} ELO
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <StatCard label="Victoires"  value={player.wins} />
            <StatCard label="Défaites"   value={player.losses} />
            <StatCard label="Winrate"    value={`${getWinrate()}%`} />
            <StatCard label="Tournois"   value={player.tournaments_won} />
          </div>
        </div>
      </motion.div>

      {/* ELO CHART */}
      <EloChart username={player.username} currentElo={player.elo} />

      {/* Match History */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#12192f] rounded-3xl p-8 border border-purple-500/20"
      >
        <h2 className="text-3xl font-bold mb-8">Historique des matchs</h2>

        <div className="space-y-4">
          {matches.map((match) => {
            const victory = match.winner === player.username
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={match.id}
                className={`
                  p-5 rounded-2xl border
                  ${victory
                    ? 'bg-green-500/10 border-green-400/20'
                    : 'bg-red-500/10 border-red-400/20'}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">
                      {match.player1} VS {match.player2}
                    </div>
                    <div className="text-gray-400 mt-1">Score : {match.score}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${victory ? 'text-green-400' : 'text-red-400'}`}>
                      {victory ? 'VICTOIRE' : 'DÉFAITE'}
                    </div>
                    <div className="text-cyan-300 mt-1">
                      {victory ? '+' : '-'}{Math.abs(match.elo_gain)} ELO
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {matches.length === 0 && (
            <div className="text-center py-10 text-white/30">
              Aucun match joué.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-black/20 border border-white/5 rounded-2xl p-5 text-center min-w-[140px]">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  )
}
