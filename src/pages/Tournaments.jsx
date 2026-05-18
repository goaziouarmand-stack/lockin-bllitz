import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Tournaments() {

  const [tournament, setTournament] =
  useState(null)

  const [matches, setMatches] =
  useState([])

  useEffect(() => {
    fetchTournament()
  }, [])

  async function fetchTournament() {

  const { data: tournamentData } =
    await supabase
      .from('tournaments')
      .select('*')
      .limit(1)
      .single()

  setTournament(tournamentData)

  if (!tournamentData) return

  const { data: matchData } =
    await supabase
      .from('tournament_matches')
      .select('*')
      .eq(
        'tournament_id',
        tournamentData.id
      )

  setMatches(matchData || [])
}

  const tournamentDate =
  tournament?.tournament_date
    ? new Date(
        tournament.tournament_date
      )
    : new Date()

  const now = new Date()

  const diff =
    tournamentDate.getTime() -
    now.getTime()

  const days = Math.max(
    Math.floor(diff / (1000 * 60 * 60 * 24)),
    0
  )

  const hours = Math.max(
    Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    ),
    0
  )

  const groupedRounds = {}

    matches.forEach((match) => {

      if (!groupedRounds[match.round]) {
        groupedRounds[match.round] = []
      }

      groupedRounds[match.round].push(match)
    })

    const rounds = Object.entries(
      groupedRounds
    ).map(([title, matches]) => ({
      title,
      matches,
    }))

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            text-4xl
            sm:text-5xl
            lg:text-6xl

            font-black

            bg-gradient-to-r
            from-purple-400
            to-cyan-400

            bg-clip-text
            text-transparent
          "
        >
          TOURNAMENT
        </motion.h1>

        <p className="text-white/60 mt-3 text-lg">
          Monthly Summoners War Clash
        </p>

      </div>

      {/* COUNTDOWN */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          relative
          overflow-hidden

          rounded-3xl
          border
          border-cyan-400/20

          bg-gradient-to-br
          from-[#151d35]
          to-[#0b1120]

          p-8
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-purple-500/10
            to-cyan-500/10
          "
        />

        <div className="relative z-10">

          <div className="text-white/50 text-sm">
            NEXT TOURNAMENT
          </div>

          <div
            className="
              mt-3

              text-5xl
              sm:text-6xl

              font-black
              text-cyan-400
            "
          >
            {days}D {hours}H
          </div>

          <div className="mt-4 text-white/70">
            June 15 • 20:00 CET
          </div>

        </div>

      </motion.div>

      {/* BRACKET */}
      <div
        className="
          overflow-x-auto
          pb-6
        "
      >

        <div
          className="
            flex
            gap-12
            min-w-[900px]
          "
        >

          {rounds.map((round) => (

            <div
              key={round.title}
              className="flex-1"
            >

              {/* ROUND TITLE */}
              <div
                className="
                  mb-6
                  text-center
                  text-cyan-300
                  font-bold
                  text-xl
                "
              >
                {round.title}
              </div>

              {/* MATCHES */}
              <div className="space-y-8">

                {round.matches.map(
                  (match, index) => (

                  <motion.div
                    key={index}
                    whileHover={{
                      scale: 1.03,
                    }}
                    className="
                      relative
                      overflow-hidden

                      rounded-2xl

                      border
                      border-cyan-400/20

                      bg-gradient-to-br
                      from-[#151d35]
                      to-[#0b1120]

                      p-4

                      shadow-xl
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

                    <div className="relative z-10">

                      {/* PLAYER 1 */}
                      <div
                        className="
                          flex
                          justify-between
                          items-center

                          rounded-xl

                          bg-black/20

                          px-4
                          py-3
                        "
                      >

                        <span className="font-semibold">
                          {match.player1}
                        </span>

                        <span className="text-cyan-300">
                          {match.score1}
                        </span>

                      </div>

                      {/* PLAYER 2 */}
                      <div
                        className="
                          flex
                          justify-between
                          items-center

                          rounded-xl

                          bg-black/20

                          px-4
                          py-3
                          mt-3
                        "
                      >

                        <span className="font-semibold">
                          {match.player2}
                        </span>

                        <span className="text-cyan-300">
                          {match.score2}
                        </span>

                      </div>

                    </div>

                  </motion.div>
                ))}

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}