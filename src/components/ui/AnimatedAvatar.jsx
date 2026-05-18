import { motion } from 'framer-motion'

export default function AnimatedAvatar({
  username,
  rank,
}) {
  function getBorder() {
    if (rank === 1) {
      return `
        from-yellow-300
        via-yellow-500
        to-orange-400
      `
    }

    if (rank === 2) {
      return `
        from-gray-200
        via-gray-400
        to-gray-500
      `
    }

    if (rank === 3) {
      return `
        from-orange-300
        via-orange-500
        to-red-500
      `
    }

    return `
      from-purple-500
      via-cyan-400
      to-purple-500
    `
  }

  return (
    <motion.div
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
      }}
      className="relative"
    >
      {/* Glow */}
      <motion.div
        animate={{
          opacity: [0.5, 0.9, 0.5],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className={`
          absolute
          inset-0
          rounded-full
          blur-xl
          bg-gradient-to-r
          ${getBorder()}
          opacity-70
        `}
      />

      {/* Border */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
        className={`
          relative
          p-[3px]
          rounded-full
          bg-gradient-to-r
          ${getBorder()}
        `}
      >
        {/* Avatar */}
        <div
          className="
            w-16
            h-16
            rounded-full
            bg-[#0c1224]
            flex
            items-center
            justify-center
            text-xl
            font-bold
            border
            border-white/10
            backdrop-blur-xl
          "
        >
          {username.charAt(0).toUpperCase()}
        </div>
      </motion.div>
    </motion.div>
  )
}