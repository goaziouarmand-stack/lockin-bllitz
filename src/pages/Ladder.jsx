import Leaderboard from '../components/ladder/Leaderboard'
import { motion } from 'framer-motion'

export default function Ladder() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <motion.h1
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-5xl 
            font-bold             "
>
  Lockin Blitz
</motion.h1>

        <p className="text-white/70 mt-2">
          Classement de guilde
        </p>
      </div>

      <Leaderboard />
    </div>
  )
}