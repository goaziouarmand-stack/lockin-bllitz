import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MatchFeed from '../components/home/MatchFeed'
import Cup from '../components/home/Cup'

export default function Home() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section
        className="
          relative overflow-hidden
          rounded-[32px] border border-white/10
          bg-gradient-to-br from-[#121a30] via-[#0b1120] to-[#070b14]
          p-8 lg:p-12
          shadow-[0_0_80px_rgba(34,211,238,0.08)]
        "
      >
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_40%)] animate-pulse" />

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm uppercase tracking-[0.35em] text-cyan-300 mb-4"
          >
            COMPETITION OFFICIELLE
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="
              text-5xl lg:text-7xl font-black leading-none
              bg-gradient-to-r from-cyan-300 via-white to-amber-300
              bg-clip-text text-transparent
            "
          >
            LOCKIN
            <br />
            BLITZ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300"
          >
            Retrouvez les résultats, le ladder et les tournois
            mensuels de la scène compétitive summoners war.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link to="/ladder">
              <button className="
                rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600
                px-8 py-4 text-lg font-bold transition-all duration-500
                hover:scale-105 hover:from-cyan-400 hover:to-amber-400
                shadow-[0_0_35px_rgba(34,211,238,0.25)]
              ">
                Voir Ladder
              </button>
            </Link>

            <Link to="/tournaments">
              <button className="
                rounded-2xl border border-white/10 bg-white/5
                px-8 py-4 text-lg font-bold transition-all duration-300
                hover:bg-white/10
              ">
                Voir Tournois
              </button>
            </Link>
          </motion.div>

          <div className="mt-10 flex w-fit items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-red-300">
              LIVE — Tournois en cours
            </span>
          </div>
        </div>
      </section>

    {/* IMG CUP */}
      <Cup />

      {/* MATCH FEED */}
      <MatchFeed />
    </div>
  )
}
