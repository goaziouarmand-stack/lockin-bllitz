import { motion } from 'framer-motion'

export default function Cup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex justify-center"
    >
      <motion.img
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        src="https://ddatdqfjmerjmigmmefo.supabase.co/storage/v1/object/public/ranks/blitzcup.png"
        alt="Tournament Cup"
        className="
          w-full
          
          object-contain
          drop-shadow-[0_0_40px_rgba(251,191,36,0.35)]
        "
      />
    </motion.div>
  )
}