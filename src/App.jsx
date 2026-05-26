import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'

import Home from './pages/Home'
import Ladder from './pages/Ladder'
import Players from './pages/Players'
import Tournaments from './pages/Tournaments'
import PlayerProfile from './pages/PlayerProfile'
import Admin from './pages/Admin'

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      {/* BACKGROUND GLOW */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(251,191,36,0.06),transparent_35%)]
        "
      />

      {/* LIGHT TEXTURE */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          opacity-[0.03]
          -z-10
          bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]
        "
      />

      <Sidebar />

      <main
        className="
          relative
          z-10
          ml-0
          lg:ml-72
          min-h-screen
          p-4
          sm:p-6
          lg:p-10
        "
      >
        <Routes>
          <Route path="/"                  element={<Home />}          />
          <Route path="/ladder"            element={<Ladder />}        />
          <Route path="/players"           element={<Players />}       />
          <Route path="/players/:username" element={<PlayerProfile />} />
          <Route path="/tournaments"       element={<Tournaments />}   />
          <Route path="/admin"             element={<Admin />}         />
        </Routes>
      </main>
    </div>
  )
}

export default App
