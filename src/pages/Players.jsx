import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { supabase } from '../lib/supabase'
import AnimatedAvatar from '../components/ui/AnimatedAvatar'
import MonsterIcons from '../components/ui/MonsterIcons'

export default function Players() {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('elo', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setPlayers(data || [])
  }

  function getWinrate(player) {
    const total =
      player.wins + player.losses

    if (total === 0) return 0

    return Math.round(
      (player.wins / total) * 100
    )
  }

  function getRankName(elo) {
    if (elo >= 1400) return 'Guardian'
    if (elo >= 1250) return 'Conqueror'
    if (elo >= 1100) return 'Fighter'

    return 'Challenger'
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            text-6xl
            font-black
            bg-gradient-to-r
            from-cyan-300
            via-slate-100
            to-amber-300

            bg-clip-text
            text-white
          "
        >
          JOUEURS
        </motion.h1>

        <p className="text-white/60 mt-3 text-lg">
          Classement des invocateurs du ladder mensuel
        </p>
      </div>

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {players.map((player, index) => (
          <Link
            key={player.id}
            to={`/players/${player.username}`}
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.03,
                y: -5,
              }}
              className="
                relative
                overflow-hidden

                rounded-3xl
                border
                border-purple-500/20

                bg-gradient-to-br
                from-[#121a30]
                to-[#0a0f1c]

                p-6

                shadow-2xl
                transition-all
              "
            >

              {/* Glow */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-purple-500/5
                  to-cyan-500/5
                "
              />

              {/* TOP */}
              <div
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-4">

                  <AnimatedAvatar
                    username={player.username}
                    rank={index + 1}
                  />

                  <div>

                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-white
                      "
                    >
                      {player.username}
                    </h2>

                    <div
                      className="
                        mt-2
                        inline-flex
                        px-3
                        py-1
                        rounded-xl
                        bg-cyan-500/10
                        border
                        border-white/10
                        text-cyan-300
                        text-sm
                        font-semibold
                      "
                    >
                      {getRankName(player.elo)}
                    </div>

                  </div>

                </div>

                <div className="text-right">

                  <div
                    className="
                      text-4xl
                      font-black
                      text-cyan-400
                    "
                  >
                    {player.elo}
                  </div>

                  <div className="text-white/50">
                    ELO
                  </div>

                </div>

              </div>

              {/* STATS */}
              <div
                className="
                  relative
                  z-10
                  grid
                  grid-cols-3
                  gap-4
                  mt-8
                "
              >

                <StatBox
                  label="Wins"
                  value={player.wins}
                />

                <StatBox
                  label="Losses"
                  value={player.losses}
                />

                <StatBox
                  label="Winrate"
                  value={`${getWinrate(player)}%`}
                />

              </div>

              {/* Favorite Monsters */}
<div
  className="
    relative
    z-10
    mt-6
  "
>

  <div className="text-white/50 text-sm mb-3">
    Most Played Monsters
  </div>

  <MonsterIcons
    monsters={[
      player.monster_1,
      player.monster_2,
      player.monster_3,
      player.monster_4,
    ]}
  />

</div>

              {/* Footer */}
              <div
                className="
                  relative
                  z-10
                  mt-6
                  pt-4
                  border-t
                  border-white/5
                  flex
                  justify-between
                  items-center
                "
              >

                <div className="text-white/40 text-sm">
                  Rank #{index + 1}
                </div>

                <div
                  className="
                    text-cyan-300
                    text-sm
                    font-semibold
                  "
                >
                  Voir profil →
                </div>

              </div>

            </motion.div>

          </Link>
        ))}

      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div
      className="
        rounded-2xl
        bg-black/20
        border
        border-white/5
        p-4
        text-center
      "
    >

      <div className="text-white/50 text-sm">
        {label}
      </div>

      <div
        className="
          text-2xl
          font-bold
          mt-2
        "
      >
        {value}
      </div>

    </div>
  )
}