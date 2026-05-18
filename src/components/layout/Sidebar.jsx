import { useState } from 'react'
import {
  Menu,
  X,
  Home,
  Trophy,
  Users,
  Shield,
  Swords,
  House
} from 'lucide-react'

import { Link } from 'react-router-dom'

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const links = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
    },
    {
      name: 'Ladder',
      path: '/ladder',
      icon: Trophy,
    },
    {
      name: 'Players',
      path: '/players',
      icon: Users,
    },
    {
      name: 'Tournaments',
      path: '/tournaments',
      icon: Swords,
    },
    {
      name: 'Admin',
      path: '/',
      icon: Shield,
    },
  ]

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          lg:hidden
          fixed
          top-4
          left-4
          z-50

          bg-[#111827]
          border
          border-cyan-400/20

          p-3
          rounded-xl
          text-white
        "
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          top-0
          left-0

          h-screen
          w-72

          bg-[#0b1120]/95
          backdrop-blur-xl

          border-r
          border-cyan-400/10

          z-50

          transform
          transition-transform
          duration-300

          ${
            open
              ? 'translate-x-0'
              : '-translate-x-full'
          }

          lg:translate-x-0
        `}
      >

        {/* LOGO */}
        <div className="p-8">

          <h1
            className="
              text-3xl
              font-black
              bg-gradient-to-r
              from-purple-400
              to-cyan-400
              bg-clip-text
              text-transparent
            "
          >
            SW Ladder
          </h1>

          <p className="text-white/50 mt-2 text-sm">
            Monthly Tournament
          </p>

        </div>

        {/* LINKS */}
        <nav className="px-4 space-y-2">

          {links.map((link) => {
            const Icon = link.icon

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="
                  flex
                  items-center
                  gap-4

                  px-4
                  py-4

                  rounded-2xl

                  text-white/70

                  hover:bg-cyan-500/10
                  hover:text-cyan-300

                  transition-all
                "
              >

                <Icon size={22} />

                <span className="font-semibold">
                  {link.name}
                </span>

              </Link>
            )
          })}

        </nav>

      </aside>
    </>
  )
}