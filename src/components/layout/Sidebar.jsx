import { useState } from 'react'
import { Menu, X, Home, Trophy, Users, Swords } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { name: 'Home',         path: '/',            icon: Home   },
  { name: 'Ladder',      path: '/ladder',      icon: Trophy },
  { name: 'Players',     path: '/players',     icon: Users  },
  { name: 'Tournaments', path: '/tournaments', icon: Swords },
]

function SidebarContent({ onNavigate }) {
  const { pathname } = useLocation()

  return (
    <div className="flex flex-col h-full p-6 gap-2">
      {/* LOGO */}
      <div className="mb-8">
        <h1 className="
          text-2xl font-black
          bg-gradient-to-r from-cyan-300 to-amber-300
          bg-clip-text text-transparent
        ">
          LOCKIN BLITZ
        </h1>
        <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">
          Guild Tournament
        </p>
      </div>

      {/* LINKS */}
      {links.map(({ name, path, icon: Icon }) => {
        const isActive = pathname === path
        return (
          <Link
            key={path}
            to={path}
            onClick={onNavigate}
            className={`
              flex items-center gap-4
              px-4 py-3 rounded-2xl
              font-semibold transition-all duration-200
              ${isActive
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/50 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Icon size={20} />
            {name}
          </Link>
        )
      })}
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(o => !o)}
        className="
          fixed top-4 left-4 z-[100] lg:hidden
          rounded-2xl border border-white/10
          bg-[#10192e] p-3 text-white
        "
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={close}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      {/* MOBILE DRAWER */}
      {open && (
        <aside className="
          fixed top-0 left-0 z-50 h-full w-72 lg:hidden
          border-r border-white/10 bg-[#0b1120]
        ">
          <SidebarContent onNavigate={close} />
        </aside>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="
        hidden lg:flex lg:flex-col
        fixed top-0 left-0 z-50
        h-full w-72
        border-r border-white/10 bg-[#0b1120]
      ">
        <SidebarContent onNavigate={() => {}} />
      </aside>
    </>
  )
}