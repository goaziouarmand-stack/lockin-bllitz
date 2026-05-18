import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b border-purple-500/20 bg-[#0c1224] backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white/80">
          SW Ladder
        </h1>

        <div className="flex gap-6 text-sm">
          <Link to="/">Accueil</Link>
          <Link to="/ladder">Ladder</Link>
          <Link to="/players">Joueurs</Link>
          <Link to="/tournaments">Tournois</Link>
{/*          <Link to="/admin">Admin</Link>*/}
        </div>
      </div>
    </nav>
  )
}