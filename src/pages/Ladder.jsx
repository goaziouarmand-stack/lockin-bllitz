import { motion } from 'framer-motion'
import Leaderboard from '../components/ladder/Leaderboard'

export default function Ladder() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            text-5xl lg:text-6xl
            font-black
            bg-gradient-to-r
            from-cyan-300
            via-slate-100
            to-amber-300
            bg-clip-text
            text-transparent
          "
        >
          LADDER
        </motion.h1>
        <p className="text-white/60 mt-3 text-lg">
          Classement de guilde
        </p>
      </div>

      <Leaderboard />
    </div>
  )
}