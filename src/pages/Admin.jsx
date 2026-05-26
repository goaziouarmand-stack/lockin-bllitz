import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_PIN = '2408'

export default function Admin() {
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [badgeName, setBadgeName] = useState('')
  const [badgeIcon, setBadgeIcon] = useState('')


  useEffect(() => {
    const saved = sessionStorage.getItem('lockin_admin')

    if (saved === 'true') {
      setAuthenticated(true)
      fetchData()
    }
  }, [])

  async function fetchData() {
    const { data: playersData } = await supabase
      .from('players')
      .select('*')
      .order('elo', { ascending: false })

    const { data: matchesData } = await supabase
      .from('tournament_matches')
      .select('*')

    setPlayers(Array.isArray(playersData) ? playersData : [])
    setMatches(Array.isArray(matchesData) ? matchesData : [])
  }

  function login() {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('lockin_admin', 'true')
      setAuthenticated(true)
      fetchData()
    }
  }

  function logout() {
    sessionStorage.removeItem('lockin_admin')
    setAuthenticated(false)
  }

  async function updatePlayer(id, field, value) {
    const { error } = await supabase
      .from('players')
      .update({
        [field]: value,
      })
      .eq('id', id)

    if (!error) {
      fetchData()
    }
  }

  async function addPlayer() {
    const { error } = await supabase
      .from('players')
      .insert([
        {
          username: 'New Player',
          elo: 1000,
          wins: 0,
          losses: 0,

          monster_1: '',
          monster_2: '',
          monster_3: '',
          monster_4: '',
        },
      ])

    if (!error) {
      fetchData()
    }
  }

  async function deletePlayer(id) {
    const confirmed = window.confirm(
      'Delete this player?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchData()
    }
  }

  async function addBadge(player) {
    if (!badgeName || !badgeIcon) return

    const currentBadges = player.badges || []

    const updatedBadges = [
      ...currentBadges,
      {
        name: badgeName,
        icon: badgeIcon,
      },
    ]

    const { error } = await supabase
      .from('players')
      .update({
        badges: updatedBadges,
      })
      .eq('id', player.id)

    if (!error) {
      setBadgeName('')
      setBadgeIcon('')

      fetchData()
    }
  }

  async function deleteBadge(player, index) {
    const updatedBadges = [...(player.badges || [])]

    updatedBadges.splice(index, 1)

    const { error } = await supabase
      .from('players')
      .update({
        badges: updatedBadges,
      })
      .eq('id', player.id)

    if (!error) {
      fetchData()
    }
  }


  async function updateMatch(id, field, value) {
    const { error } = await supabase
      .from('tournament_matches')
      .update({
        [field]: value,
      })
      .eq('id', id)

    if (!error) {
      fetchData()
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="
            w-full
            max-w-md

            rounded-3xl

            border
            border-white/10

            bg-gradient-to-br
            from-[#121a30]
            to-[#0a1020]

            p-8

            shadow-[0_0_60px_rgba(34,211,238,0.08)]
          "
        >
          <h1
            className="
              text-4xl
              font-black

              text-center

              bg-gradient-to-r
              from-cyan-300
              to-amber-300

              bg-clip-text
              text-transparent
            "
          >
            ADMIN ACCESS
          </h1>

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="
              w-full
              mt-8

              rounded-2xl

              border
              border-white/10

              bg-black/30

              px-5
              py-4

              text-white
            "
          />

          <button
            onClick={login}
            className="
              w-full
              mt-5

              rounded-2xl

              bg-gradient-to-r
              from-cyan-500
              to-blue-600

              py-4

              font-bold

              transition-all
              duration-300

              hover:scale-[1.02]
            "
          >
            LOGIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-white">
            Admin Panel
          </h1>
        </div>

        <button
          onClick={logout}
          className="
            rounded-2xl

            border
            border-red-500/20

            bg-red-500/10

            px-5
            py-3

            font-bold
            text-red-300
          "
        >
          Logout
        </button>
      </div>

      {/* PLAYERS */}
      <section>
        <h2 className="text-3xl font-black text-cyan-300 mb-6">
          Players
        </h2>

        <button
          onClick={addPlayer}
          className="
            mb-6

            rounded-2xl

            bg-gradient-to-r
            from-cyan-500
            to-blue-600

            px-5
            py-3

            font-bold

            transition-all
            duration-300

            hover:scale-[1.02]
          "
        >
          + Add Player
        </button>


        <div className="space-y-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="
                rounded-3xl

                border
                border-white/10

                bg-[#121a30]

                p-6

                space-y-6
              "
            >
              {/* PLAYER INFOS */}
              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-4

                  gap-4
                "
              >
                <input
                  value={player.username}
                  onChange={(e) =>
                    updatePlayer(player.id, 'username', e.target.value)
                  }
                  className="admin-input"
                  placeholder="Username"
                />

                <input
                  type="number"
                  value={player.elo}
                  onChange={(e) =>
                    updatePlayer(player.id, 'elo', e.target.value)
                  }
                  className="admin-input"
                  placeholder="ELO"
                />

                <input
                  type="number"
                  value={player.wins}
                  onChange={(e) =>
                    updatePlayer(player.id, 'wins', e.target.value)
                  }
                  className="admin-input"
                  placeholder="Wins"
                />

                <input
                  type="number"
                  value={player.losses}
                  onChange={(e) =>
                    updatePlayer(player.id, 'losses', e.target.value)
                  }
                  className="admin-input"
                  placeholder="Losses"
                />
              </div>

              {/* MONSTERS */}
              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-4

                  gap-4
                "
              >
                <input
                  value={player.monster_1 || ''}
                  onChange={(e) =>
                    updatePlayer(player.id, 'monster_1', e.target.value)
                  }
                  className="admin-input"
                  placeholder="Monster 1"
                />

                <input
                  value={player.monster_2 || ''}
                  onChange={(e) =>
                    updatePlayer(player.id, 'monster_2', e.target.value)
                  }
                  className="admin-input"
                  placeholder="Monster 2"
                />

                <input
                  value={player.monster_3 || ''}
                  onChange={(e) =>
                    updatePlayer(player.id, 'monster_3', e.target.value)
                  }
                  className="admin-input"
                  placeholder="Monster 3"
                />

                <input
                  value={player.monster_4 || ''}
                  onChange={(e) =>
                    updatePlayer(player.id, 'monster_4', e.target.value)
                  }
                  className="admin-input"
                  placeholder="Monster 4"
                />
              </div>

              {/* BADGES */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {(player.badges || []).map((badge, index) => (
                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        border
                        border-white/10

                        bg-black/20

                        px-4
                        py-2
                      "
                    >
                      <img
                        src={badge.icon}
                        alt={badge.name}
                        className="
                          w-8
                          h-8

                          object-contain
                        "
                      />

                      <span className="text-sm font-bold text-white">
                        {badge.name}
                      </span>

                      <button
                        onClick={() => deleteBadge(player, index)}
                        className="
                          text-red-400
                          font-bold
                        "
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                  <input
                    placeholder="Badge Name"
                    value={badgeName}
                    onChange={(e) => setBadgeName(e.target.value)}
                    className="admin-input"
                  />

                  <input
                    placeholder="Badge Icon URL"
                    value={badgeIcon}
                    onChange={(e) => setBadgeIcon(e.target.value)}
                    className="admin-input"
                  />

                  <button
                    onClick={() => addBadge(player)}
                    className="
                      rounded-2xl

                      bg-gradient-to-r
                      from-amber-400
                      to-orange-500

                      px-5
                      py-3

                      font-bold

                      whitespace-nowrap
                    "
                  >
                    Add Badge
                  </button>
                </div>
              </div>

              {/* DELETE */}
              <div className="flex justify-end">
                <button
                  onClick={() => deletePlayer(player.id)}
                  className="
                    rounded-2xl

                    border
                    border-red-500/20

                    bg-red-500/10

                    px-5
                    py-3

                    font-bold
                    text-red-300

                    transition-all
                    duration-300

                    hover:bg-red-500/20
                  "
                >
                  Delete Player
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MATCHES */}
      <section>
        <h2 className="text-3xl font-black text-amber-300 mb-6">
          Tournament Matches
        </h2>

        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="
                rounded-3xl

                border
                border-white/10

                bg-[#121a30]

                p-6

                grid
                grid-cols-1
                lg:grid-cols-6

                gap-4
              "
            >
              <input
                value={match.round}
                onChange={(e) =>
                  updateMatch(match.id, 'round', e.target.value)
                }
                className="admin-input"
              />

              <input
                value={match.player1}
                onChange={(e) =>
                  updateMatch(match.id, 'player1', e.target.value)
                }
                className="admin-input"
              />

              <input
                value={match.player2}
                onChange={(e) =>
                  updateMatch(match.id, 'player2', e.target.value)
                }
                className="admin-input"
              />

              <input
                type="number"
                value={match.score1 || 0}
                onChange={(e) =>
                  updateMatch(match.id, 'score1', e.target.value)
                }
                className="admin-input"
              />

              <input
                type="number"
                value={match.score2 || 0}
                onChange={(e) =>
                  updateMatch(match.id, 'score2', e.target.value)
                }
                className="admin-input"
              />

              <input
                value={match.winner || ''}
                onChange={(e) =>
                  updateMatch(match.id, 'winner', e.target.value)
                }
                className="admin-input"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}