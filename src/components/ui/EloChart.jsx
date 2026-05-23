import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-[#0d1325] border border-white/10 rounded-xl px-4 py-3 text-sm shadow-xl">
      <div className="text-white/50 mb-1">{d.date}</div>
      <div className="text-cyan-300 font-black text-lg">{d.elo} ELO</div>
      {d.reason && <div className="text-white/40 mt-1 text-xs">{d.reason}</div>}
    </div>
  )
}

export default function EloChart({ username, currentElo }) {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetch() {
      const { data: history } = await supabase
        .from('elo_history')
        .select('*')
        .eq('player_username', username)
        .order('created_at', { ascending: true })
        .limit(30)

      if (!history?.length) {
        setData([{ date: 'Maintenant', elo: currentElo }])
        return
      }

      const points = history.map(row => ({
        date: new Date(row.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'short',
        }),
        elo: row.new_elo,
        reason: row.reason,
      }))

      // Ajoute l'ELO actuel comme dernier point
      points.push({ date: 'Maintenant', elo: currentElo })

      setData(points)
    }
    fetch()
  }, [username, currentElo])

  const min = Math.min(...data.map(d => d.elo)) - 30
  const max = Math.max(...data.map(d => d.elo)) + 30

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="
        rounded-3xl border border-white/10
        bg-gradient-to-br from-[#131b32] to-[#0d1325]
        p-6 space-y-4
      "
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Évolution ELO</h3>
        <span className="text-cyan-400 font-black text-xl">{currentElo}</span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="eloGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[min, max]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="elo"
            stroke="#22d3ee"
            strokeWidth={2.5}
            fill="url(#eloGrad)"
            dot={{ fill: '#22d3ee', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
