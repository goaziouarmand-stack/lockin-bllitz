import { useState } from 'react'

import {
  Menu,
  X,
  Home,
  Trophy,
  Users,
  Swords,
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
          fixed
          top-4
          left-4
          z-[100]

          lg:hidden

          rounded-2xl
          border
          border-white/10

          bg-[#10192e]

          p-3

          text-white
        "
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/70
            lg:hidden
          "
        />
      )}

}