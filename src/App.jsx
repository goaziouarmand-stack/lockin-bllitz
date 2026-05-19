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
            bg-[radial-gradient(circle_at_top,#16213b_0%,#090d18_45%,#05070d_100%)]
            text-slate-100"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden z-0">

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
    relative
    z-10

    min-h-screen

    ml-0
    lg:ml-[288px]

    p-4
    sm:p-6
    lg:p-10
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