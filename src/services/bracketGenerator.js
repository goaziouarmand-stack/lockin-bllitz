export function generateBracket(players) {
  const shuffled = [...players].sort(() => Math.random() - 0.5)

  const matches = []

  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      player1: shuffled[i],
      player2: shuffled[i + 1] || 'BYE',
    })
  }

  return matches
}