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
<div
  className="
    flex
    items-center
    justify-center

    w-20
    h-20

    overflow-hidden
  "
>
  <img
    src={rank.icon}
    alt={rank.name}
    className="
      w-full
      h-full

      object-contain

      scale-[2.2]

      drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]
    "
  />
</div>
      {rank.name}
    </span>
  )
}