import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import AnimatedAvatar from '../ui/AnimatedAvatar'
import RankBadge from '../ui/RankBadge'
import { Link } from 'react-router-dom'

export default function Leaderboard() {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('elo', { ascending: false })

    if (error) { console.error(error); return }
    setPlayers(data)
  }

  function getRankStyles(index) {
    if (index === 0) return 'border-yellow-400 shadow-yellow-500/20'
    if (index === 1) return 'border-gray-300 shadow-gray-400/20'
    if (index === 2) return 'border-orange-500 shadow-orange-500/20'
    return 'border-purple-500/20 shadow-purple-500/10'
  }

  return (
    <div className="space-y-5">
      {players.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className={`
            relative overflow-hidden
            bg-gradient-to-br from-[#151d35] to-[#0d1328]
            border ${getRankStyles(index)}
            rounded-2xl p-5
            flex items-center justify-between
            shadow-xl transition-all
          `}
        >
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 pointer-events-none"
          />

          {/* Left */}
          <div className="flex items-center gap-4 z-10">
            <AnimatedAvatar username={player.username} rank={index + 1} />

            <Link to={`/players/${player.username}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded-lg text-xs font-bold bg-white/5 text-white/40 border border-white/10">
                  #{index + 1}
                </span>
                <RankBadge elo={player.elo} size="sm" />
              </div>
              <h2 className="text-2xl font-semibold">{player.username}</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {player.wins}V • {player.losses}D
              </p>
            </Link>
          </div>

          {/* Right */}
          <div className="text-right z-10">
            <motion.div
              animate={{ textShadow: ['0 0 5px #38bdf8', '0 0 15px #38bdf8', '0 0 5px #38bdf8'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl font-bold text-cyan-400"
            >
              {player.elo}
            </motion.div>
            <div className="text-sm text-gray-400">ELO</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
