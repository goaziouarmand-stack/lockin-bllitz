export function calculateElo(playerRating, opponentRating, result) {
  const K = 32

  const expected =
    1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400))

  const newRating = playerRating + K * (result - expected)

  return Math.round(newRating)
}