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

    bg-[#0b1120]/80

    border-r
    border-white/10

    z-50

    overflow-hidden

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
<div
  className="
    relative
    z-10
    flex
    items-center
    justify-center

    py-6
  "
>

  <img
    src="/lockinblitz-logo.png"
    alt="LockIn Blitz"

    className="
      w-[220px]

      drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]

      hover:scale-105

      transition-all
      duration-500
    "
  />

</div>

        {/* LINKS */}
        <nav className="relative
            z-10
            px-4 
            space-y-2">

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
          <div
            className="
              absolute
              inset-0
              z-0

              bg-gradient-to-b
              from-cyan-500/5
              via-transparent
              to-amber-500/5

              pointer-events-none
            "
          />
      </aside>
    </>
  )
}