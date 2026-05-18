import { motion } from 'framer-motion'

export default function MonsterIcons({
  monsters = [],
}) {
  return (
    <div className="flex items-center gap-3">

      {monsters.map((monster) => {

        if (!monster) return null

        const image =
          `/monsters/${monster.toLowerCase()}.png`

        return (
          <motion.div
            key={monster}
            whileHover={{
              scale: 1.1,
              y: -3,
            }}
            className="relative"
          >

            <div
              className="
                absolute
                inset-0
                rounded-xl
                bg-cyan-400/20
                blur-md
              "
            />

            <div
              className="
                relative
                w-14
                h-14
                rounded-xl
                overflow-hidden
                border
                border-cyan-400/20
                bg-[#111827]
              "
            >

              <img
                src={image}
                alt={monster}
                className="
                  w-full
                  h-full
                  object-cover
                "
                onError={(e) => {
                  e.target.src =
                    '/monsters/default.png'
                }}
              />

            </div>

          </motion.div>
        )
      })}
    </div>
  )
}