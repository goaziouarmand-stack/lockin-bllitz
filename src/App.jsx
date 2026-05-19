import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'

import Home from './pages/Home'
import Ladder from './pages/Ladder'
import Players from './pages/Players'
import Tournaments from './pages/Tournaments'

function App() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <Sidebar />

      <main
        className="
          ml-0
          lg:ml-72

          min-h-screen

          p-6
        "
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ladder" element={<Ladder />} />
          <Route path="/players" element={<Players />} />
          <Route path="/tournaments" element={<Tournaments />} />
        </Routes>
      </main>
    </div>
  )
}

export default App