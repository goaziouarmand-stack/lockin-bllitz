import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Ladder from './pages/Ladder'
import Players from './pages/Players'
import Tournaments from './pages/Tournaments'
import Admin from './pages/Admin'
import PlayerProfile from './pages/PlayerProfile'
import VideoBackground from './components/ui/VideoBackground'

import Sidebar from './components/layout/Sidebar'

export default function App() {
  return (
    <BrowserRouter>
      <div
        className="
          min-h-screen
          bg-[#070b17]
          text-white
          overflow-hidden
          relative
        "
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">

          <div
            className="
              absolute
              w-[700px]
              h-[700px]
              bg-purple-500/10
              rounded-full
              blur-3xl
              top-[-250px]
              left-[-250px]
              animate-pulse
            "
          />

          <div
            className="
              absolute
              w-[700px]
              h-[700px]
              bg-cyan-500/10
              rounded-full
              blur-3xl
              bottom-[-250px]
              right-[-250px]
              animate-pulse
            "
          />

        </div>

        <VideoBackground />

        <Sidebar />

        <main
  className="
    lg:ml-72
    p-4
    sm:p-6
    lg:p-8
    relative
    z-10
    backdrop-blur-[2px]
    min-h-screen
  "
>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ladder" element={<Ladder />} />
            <Route path="/players" element={<Players />} />
            <Route path="/tournaments" element={<Tournaments />} />
{/*            <Route path="/admin" element={<Admin />} />*/}
            <Route path="/players/:username" element={<PlayerProfile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}