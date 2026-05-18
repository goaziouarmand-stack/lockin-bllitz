import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { calculateElo } from '../../services/eloSystem'

export default function MatchForm() {
  const [players, setPlayers] = useState([])

  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [winner, setWinner] = useState('')
  const [score, setScore] = useState('2-0')

  useEffect(() => {
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('elo', { ascending: false })

    setPlayers(data || [])
  }

  async function submitMatch() {
    if (!player1 || !player2 || !winner) {
      alert('Complète tous les champs')
      return
    }

    if (player1 === player2) {
      alert('Impossible')
      return
    }

    const p1 = players.find(p => p.username === player1)
    const p2 = players.find(p => p.username === player2)

    const loser =
      winner === player1 ? player2 : player1

    const winnerPlayer =
      winner === player1 ? p1 : p2

    const loserPlayer =
      loser === player1 ? p1 : p2

    const winnerNewElo = calculateElo(
      winnerPlayer.elo,
      loserPlayer.elo,
      1
    )

    const loserNewElo = calculateElo(
      loserPlayer.elo,
      winnerPlayer.elo,
      0
    )

    const eloGain =
      winnerNewElo - winnerPlayer.elo

    // Update winner
    await supabase
      .from('players')
      .update({
        elo: winnerNewElo,
        wins: winnerPlayer.wins + 1,
      })
      .eq('username', winner)

    // Update loser
    await supabase
      .from('players')
      .update({
        elo: loserNewElo,
        losses: loserPlayer.losses + 1,
      })
      .eq('username', loser)

    // Save match
    await supabase
      .from('matches')
      .insert({
        player1,
        player2,
        winner,
        loser,
        score,
        elo_gain: eloGain,
      })

    alert('Match enregistré !')

    setPlayer1('')
    setPlayer2('')
    setWinner('')

    fetchPlayers()
  }

  return (
    <div className="bg-[#12192f] p-6 rounded-2xl border border-purple-500/20">
      <h2 className="text-2xl font-bold mb-6">
        Ajouter un match
      </h2>

      <div className="space-y-4">

        {/* Player 1 */}
        <select
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#0c1224]"
        >
          <option value="">Joueur 1</option>

          {players.map(player => (
            <option
              key={player.id}
              value={player.username}
            >
              {player.username}
            </option>
          ))}
        </select>

        {/* Player 2 */}
        <select
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#0c1224]"
        >
          <option value="">Joueur 2</option>

          {players.map(player => (
            <option
              key={player.id}
              value={player.username}
            >
              {player.username}
            </option>
          ))}
        </select>

        {/* Winner */}
        <select
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#0c1224]"
        >
          <option value="">Vainqueur</option>

          {[player1, player2]
            .filter(Boolean)
            .map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
        </select>

        {/* Score */}
        <select
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#0c1224]"
        >
          <option>2-0</option>
          <option>2-1</option>
          <option>3-0</option>
          <option>3-1</option>
          <option>3-2</option>
        </select>

        <button
          onClick={submitMatch}
          className="
            w-full
            bg-purple-500
            hover:bg-purple-400
            transition-all
            p-3
            rounded-xl
            font-semibold
          "
        >
          Enregistrer le match
        </button>
      </div>
    </div>
  )
}