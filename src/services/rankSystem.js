export const RANKS = [
  {
    name: 'Titan',
    minElo: 1500,
    color: 'from-red-400 to-orange-500',
    border: 'border-red-400/40',
    bg: 'bg-red-500/10',
    text: 'text-red-300',
    glow: 'shadow-red-500/20',
    icon: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-grandmaster.png',
  },
  {
    name: 'Guardian',
    minElo: 1350,
    color: 'from-yellow-300 to-amber-500',
    border: 'border-yellow-400/40',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-300',
    glow: 'shadow-yellow-500/20',
    icon: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-challenger.png',
  },
  {
    name: 'Conqueror',
    minElo: 1200,
    color: 'from-purple-400 to-violet-600',
    border: 'border-purple-400/40',
    bg: 'bg-purple-500/10',
    text: 'text-purple-300',
    glow: 'shadow-purple-500/20',
    icon: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-platinum.png',
  },
  {
    name: 'Fighter',
    minElo: 1100,
    color: 'from-cyan-400 to-blue-500',
    border: 'border-cyan-400/40',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-300',
    glow: 'shadow-cyan-500/20',
    icon: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-silver.png',
  },
  {
    name: 'Challenger',
    minElo: 0,
    color: 'from-slate-400 to-slate-600',
    border: 'border-slate-400/30',
    bg: 'bg-slate-500/10',
    text: 'text-slate-300',
    glow: 'shadow-slate-500/10',
    icon: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-bronze.png',
  },
]

export function getRank(elo) {
  return RANKS.find(r => elo >= r.minElo) ?? RANKS[RANKS.length - 1]
}