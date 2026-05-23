import { getRank } from '../../services/rankSystem'

export default function RankBadge({ elo, size = 'md' }) {
  const rank = getRank(elo)

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  return (
    <span
      className={`
        inline-flex items-center font-bold rounded-xl
        border ${rank.border} ${rank.bg} ${rank.text}
        ${sizes[size]}
      `}
    >
      <img
  src={rank.icon}
  alt={rank.name}
  className="
    h-14
    w-14
    object-contain

    drop-shadow-[0_0_15px_rgba(255,215,0,0.35)]
  "
/>
      {rank.name}
    </span>
  )
}