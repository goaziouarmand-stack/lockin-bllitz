import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div
      className="
        min-h-[85vh]
        flex
        items-center
      "
    >
      <div className="max-w-4xl">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            text-7xl
            font-black
            leading-tight
            bg-gradient-to-r
            from-[#121a30]
            to-[#0a0f1c]
            bg-clip-text
            text-transparent
          "
        >
          LOCKIN
          <br />
          BLITZ
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.3,
          }}
          className="
            mt-8
            text-xl
            text-white/70
            max-w-2xl
            leading-relaxed
          "
        >
          Retrouvez les résultats et le classements des tournois Blitz de Lockin.
          <br /><br />
          Matchs BO3, tournois mensuels, ELO dynamique,
          classements et affrontements spéctaculaires.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.6,
          }}
          className="flex gap-4 mt-10"
        >
          <button
            className="
              px-8
              py-4
              rounded-2xl
              bg-purple-500
              hover:bg-purple-400
              transition-all
              text-lg
              font-bold
              shadow-xl
              shadow-purple-500/30
            "
          >
            Voir le Ladder
          </button>

          <button
            className="
              px-8
              py-4
              rounded-2xl
              border
              border-cyan-400/30
              bg-white/5
              hover:bg-white/10
              transition-all
              text-lg
              font-bold
            "
          >
            Tournois
          </button>
        </motion.div>

      </div>
    </div>
  )
}