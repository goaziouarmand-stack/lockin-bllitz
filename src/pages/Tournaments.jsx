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
            from-cyan-300
            via-slate-100
            to-amber-300

            bg-clip-text
            text-transparent
          "
        >
          TOURNOIS
        </motion.h1>

        <p className="text-white/60 mt-3 text-lg">
          Blitz Mensuelle
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
          border-white/10

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
{/* TOURNAMENT TABLE */}
<div
  className="
    overflow-x-auto

    rounded-3xl
    border
    border-white/10

    bg-[#0b1120]/80
    backdrop-blur-xl
  "
>

  <table
    className="
      w-full
      min-w-[900px]

      border-collapse
      text-left
    "
  >

    {/* HEADER */}
    <thead>

      <tr
        className="
          border-b
          border-white/10

          bg-cyan-500/5
        "
      >

        <th className="p-5 text-cyan-300">
          ROUND
        </th>

        <th className="p-5 text-cyan-300">
          PLAYER 1
        </th>

        <th className="p-5 text-cyan-300">
          SCORE
        </th>

        <th className="p-5 text-cyan-300">
          PLAYER 2
        </th>

        <th className="p-5 text-cyan-300">
          WINNER
        </th>

        <th className="p-5 text-cyan-300">
          STATUS
        </th>

      </tr>

    </thead>

    {/* BODY */}
    <tbody>

      {matches.map((match, index) => (

        <motion.tr
          key={match.id}

          initial={{
            opacity: 0,
            y: 10,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: index * 0.03,
          }}

          className="
            border-b
            border-white/5

            hover:bg-gradient-to-r
            hover:from-cyan-500/5
            hover:to-amber-500/5

            transition-all
          "
        >

          {/* ROUND */}
          <td className="p-5">

            <div
              className="
                inline-flex

                px-3
                py-1

                rounded-full

                bg-purple-500/10
                border
                border-purple-500/20

                text-purple-300
                text-sm
                font-bold
              "
            >
              {match.round}
            </div>

          </td>

          {/* PLAYER 1 */}
          <td className="p-5">

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-3
                  h-3

                  rounded-full
                  bg-cyan-400
                "
              />

              <span className="font-semibold">
                {match.player1}
              </span>

            </div>

          </td>

          {/* SCORE */}
          <td className="p-5">

            <div
              className="
                text-xl
                font-black
                text-cyan-300
              "
            >
              {match.score1}
              {' - '}
              {match.score2}
            </div>

          </td>

          {/* PLAYER 2 */}
          <td className="p-5">

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-3
                  h-3

                  rounded-full
                  bg-purple-400
                "
              />

              <span className="font-semibold">
                {match.player2}
              </span>

            </div>

          </td>

          {/* WINNER */}
          <td className="p-5">

            <span
              className="
                text-green-400
                font-bold
              "
            >
              {match.winner || 'TBD'}
            </span>

          </td>

          {/* STATUS */}
          <td className="p-5">

            <div
              className="
                inline-flex

                px-3
                py-1

                rounded-full

                bg-cyan-400/10
                border
                border-white/10

                text-cyan-300
                text-xs
                font-bold
              "
            >
              LIVE
            </div>

          </td>

        </motion.tr>
      ))}

    </tbody>

  </table>

</div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}