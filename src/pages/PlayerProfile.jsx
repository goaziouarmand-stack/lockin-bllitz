import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { supabase } from '../lib/supabase'
import AnimatedAvatar from '../components/ui/AnimatedAvatar'
import RankBadge from '../components/ui/RankBadge'
import EloChart from '../components/ui/EloChart'
import MonsterIcons from '../components/ui/MonsterIcons'
import { getRank, RANKS } from '../services/rankSystem'

// ─── Winrate Ring ────────────────────────────────────────────────
function WinrateRing({ winrate }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ - (winrate / 100) * circ
  const color = winrate >= 60 ? '#4ade80' : winrate >= 45 ? '#22d3ee' : '#f87171'

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-black" style={{ color }}>{winrate}%</div>
        <div className="text-white/40 text-[10px] uppercase tracking-wider">WR</div>
      </div>
    </div>
  )
}

// ─── Rank Progress Bar ───────────────────────────────────────────
function RankProgress({ elo }) {
  const currentRankIdx = RANKS.findIndex(r => elo >= r.minElo)
  const currentRank = RANKS[currentRankIdx]
  const nextRank = RANKS[currentRankIdx - 1]

  if (!nextRank) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Rang actuel</span>
          <span className={`font-bold ${currentRank.text}`}>{currentRank.name}</span>
        </div>
        <div className="text-white/40 text-xs text-center py-2">Rang maximum atteint</div>
      </div>
    )
  }

  const gap = nextRank.minElo - currentRank.minElo
  const progress = Math.min(((elo - currentRank.minElo) / gap) * 100, 100)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
      <div className="flex justify-between text-sm">
        <span className={`font-bold ${currentRank.text}`}>{currentRank.name}</span>
        <span className="text-white/40">{nextRank.minElo - elo} ELO pour {nextRank.name}</span>
        <span className={`font-bold ${nextRank.text}`}>{nextRank.name}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${currentRank.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -3 }}
      className="bg-black/20 border border-white/5 rounded-2xl p-5 text-center"
    >
      <div className="text-white/40 text-xs uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-3xl font-black ${accent || 'text-white'}`}>{value}</div>
      {sub && <div className="text-white/30 text-xs mt-1">{sub}</div>}
    </motion.div>
  )
}

// ─── Match Row ───────────────────────────────────────────────────
function MatchRow({ match, username }) {
  const victory = match.winner === username
  const opponent = match.player1 === username ? match.player2 : match.player1

  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 4 }}
      className={`
        flex items-center justify-between
        px-5 py-4 rounded-2xl border
        transition-all
        ${victory
          ? 'bg-green-500/8 border-green-400/15 hover:border-green-400/30'
          : 'bg-red-500/8 border-red-400/15 hover:border-red-400/30'}
      `}
    >
      {/* Result badge */}
      <div className={`
        w-16 text-center text-xs font-black uppercase tracking-wider
        px-2 py-1 rounded-lg shrink-0
        ${victory ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
      `}>
        {victory ? 'WIN' : 'LOSS'}
      </div>

      {/* vs */}
      <div className="flex-1 px-4">
        <div className="font-semibold text-white">
          vs <span className="text-white/80">{opponent}</span>
        </div>
        <div className="text-white/40 text-xs mt-0.5">
          {match.score} •{' '}
          {new Date(match.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
        </div>
      </div>

      {/* ELO */}
      <div className={`text-right font-black shrink-0 ${victory ? 'text-green-400' : 'text-red-400'}`}>
        {victory ? '+' : '-'}{Math.abs(match.elo_gain)}
        <div className="text-white/30 text-xs font-normal">ELO</div>
      </div>
    </motion.div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────
export default function PlayerProfile() {
  const { username } = useParams()
  const [player, setPlayer]   = useState(null)
  const [matches, setMatches] = useState([])
  const [tab, setTab]         = useState('overview')

  useEffect(() => {
    fetchPlayer()
    fetchMatches()
  }, [username])

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

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent"
        />
        <div className="text-white/40">Chargement du profil...</div>
      </div>
    )
  }

  const rank    = getRank(player.elo)
  const total   = player.wins + player.losses
  const winrate = total === 0 ? 0 : Math.round((player.wins / total) * 100)
  const streak  = computeStreak(matches, username)
  const monsters = [player.monster_1, player.monster_2, player.monster_3, player.monster_4].filter(Boolean)

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* ── HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#131b32] to-[#090e1c] p-8 lg:p-10"
      >
        {/* Animated background glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className={`absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl bg-gradient-to-r ${rank.color} opacity-20 pointer-events-none`}
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full blur-3xl bg-cyan-500/20 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">

          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-4">
            <AnimatedAvatar username={player.username} rank={1} size="xl" />
            <div className="text-center">
              <h1 className={`text-4xl lg:text-5xl font-black bg-gradient-to-r ${rank.color} bg-clip-text text-transparent`}>
                {player.username}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                <RankBadge elo={player.elo} size="lg" />
                <motion.span
                  animate={{ textShadow: ['0 0 8px #22d3ee', '0 0 20px #22d3ee', '0 0 8px #22d3ee'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 font-black text-lg"
                >
                  {player.elo} ELO
                </motion.span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Victoires"  value={player.wins}               accent="text-green-400" />
              <StatCard label="Défaites"   value={player.losses}             accent="text-red-400"   />
              <StatCard label="Tournois"   value={player.tournaments_won ?? 0} accent="text-amber-400" />
              <StatCard label="Streak"     value={streak.label}              accent={streak.color}
                        sub={streak.count > 0 ? `${streak.count} de suite` : ''} />
            </div>

            {/* Winrate + monsters */}
            <div className="flex flex-wrap items-center gap-6 bg-black/20 border border-white/5 rounded-2xl p-5">
              <WinrateRing winrate={winrate} />
              {monsters.length > 0 && (
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-3">
                    Monstres favoris
                  </div>
                  <MonsterIcons monsters={monsters} />
                </div>
              )}
            </div>

            {/* Rank progress */}
            <RankProgress elo={player.elo} />
          </div>
        </div>
      </motion.div>

      {/* ── TABS ── */}
      <div className="flex gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 w-fit">
        {[
          { id: 'overview',  label: 'Apercu'      },
          { id: 'matches',   label: 'Matchs'      },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`
              px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${tab === t.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/40 hover:text-white/70'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <AnimatePresence mode="wait">
        {tab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* ELO Chart */}
            <EloChart username={player.username} currentElo={player.elo} />

            {/* Last 5 matches preview */}
            {matches.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-[#0d1325] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Derniers matchs</h3>
                  <button
                    onClick={() => setTab('matches')}
                    className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="space-y-3">
                  {matches.slice(0, 5).map(m => (
                    <MatchRow key={m.id} match={m} username={username} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {tab === 'matches' && (
          <motion.div
            key="matches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl border border-white/10 bg-[#0d1325] p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Historique complet</h3>
              <span className="text-white/40 text-sm">{matches.length} matchs</span>
            </div>

            <div className="space-y-3">
              {matches.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <MatchRow match={m} username={username} />
                </motion.div>
              ))}
              {matches.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  Aucun match joué.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────
function computeStreak(matches, username) {
  if (!matches.length) return { label: '—', count: 0, color: 'text-white/40' }

  let count = 0
  const firstResult = matches[0].winner === username

  for (const m of matches) {
    if ((m.winner === username) === firstResult) count++
    else break
  }

  if (firstResult) return { label: `${count}W`, count, color: 'text-green-400' }
  return { label: `${count}L`, count, color: 'text-red-400' }
}