import { motion } from 'framer-motion'

export default function Home() {
  const topPlayers = [
    {
      name: 'Mamen',
      elo: 1542,
      rank: '#1',
    },
    {
      name: 'Light',
      elo: 1498,
      rank: '#2',
    },
    {
      name: 'Kinaya',
      elo: 1461,
      rank: '#3',
    },
  ]

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section
        className="
          relative
          overflow-hidden

          rounded-[32px]

          border
          border-white/10

          bg-gradient-to-br
          from-[#121a30]
          via-[#0b1120]
          to-[#070b14]

          p-8
          lg:p-12

          shadow-[0_0_80px_rgba(34,211,238,0.08)]
        "
      >
        {/* GLOW */}
        <div
          className="
            absolute
            inset-0

            opacity-40

            bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_40%)]

            animate-pulse
          "
        />

        <div className="relative z-10">
                relative