export default function Bracket({ matches }) {
  return (
    <div className="grid gap-4">
      {matches.map((match, index) => (
        <div
          key={index}
          className="bg-[#12192f] rounded-xl p-4 border border-purple-500/20"
        >
          <div>{match.player1}</div>
          <div className="text-center text-purple-400">VS</div>
          <div>{match.player2}</div>
        </div>
      ))}
    </div>
  )
}