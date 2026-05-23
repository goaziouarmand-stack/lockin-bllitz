import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Swords } from 'lucide-react'

export default function MatchFeed() {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    // Chargement initial des 8 derniers matchs
    async function fetchRecent() {
      const { data } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)
      setMatches(data || [])
    }
    fetchRecent()

    // Supabase Realtime — écoute les nouveaux matchs
    const channel = supabase
      .channel('matches-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matches' },
        (payload) => {
          setMatches(prev => [payload.new, ...prev].slice(0, 8))
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 1)  return 'À l\'instant'
    if (mins < 60) return `Il y a ${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${Math.floor(hours / 24)}j`
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <Swords size={20} className="text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Derniers matchs</h2>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {matches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="
                relative overflow-hidden
                flex items-center justify-between
                rounded-2xl border border-white/8
                bg-gradient-to-r from-[#131b32] to-[#0d1325]
                px-5 py-4
                hover:border-white/15 transition-all
              "
            >
              {/* Winner glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none" />

              {/* Players */}
              <div className="flex items-center gap-3 z-10 flex-1 min-w-0">
                <span className="font-bold text-green-400 truncate">
                  {match.winner}
                </span>
                <span className="text-white/30 text-xs shrink-0">bat</span>
                <span className="font-semibold text-white/60 truncate">
                  {match.loser}
                </span>
              </div>

              {/* Center info */}
              <div className="flex flex-col items-center gap-1 mx-4 shrink-0 z-10">
                <span className="text-white/80 font-black text-sm">
                  {match.score}
                </span>
                <span className="text-green-400 text-xs font-bold">
                  +{match.elo_gain} ELO
                </span>
              </div>

              {/* Time */}
              <div className="text-white/30 text-xs shrink-0 z-10">
                {timeAgo(match.created_at)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {matches.length === 0 && (
          <div className="text-center py-10 text-white/30 text-sm">
            Aucun match récent.
          </div>
        )}
      </div>
    </section>
  )
}
