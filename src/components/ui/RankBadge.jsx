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
      inline-flex
      items-center
      gap-2

      font-bold
      rounded-xl

      border
      ${rank.border}
      ${rank.bg}
      ${rank.text}

      ${sizes[size]}
    `}
  >
    <img
      src={rank.icon}
      alt={rank.name}
      className="
        w-8
        h-8

        object-contain

        flex-shrink-0

        drop-shadow-[0_0_10px_rgba(34,211,238,0.25)]
      "
    />

    <span>{rank.name}</span>
  </span>
)
}