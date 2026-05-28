import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const ADMIN_PIN = '2408'

// ─── Toast ────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([])
  function push(msg, type = 'info') {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }
  return { toasts, push }
}

function ToastStack({ toasts }) {
  const colors = {
    success: 'bg-green-500/15 border-green-400/30 text-green-300',
    error:   'bg-red-500/15   border-red-400/30   text-red-300',
    info:    'bg-cyan-500/12  border-cyan-400/25  text-cyan-300',
  }
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0,  opacity: 1 }}
            exit={{   x: 24, opacity: 0 }}
            className={`px-5 py-3 rounded-xl border text-sm font-semibold tracking-wide ${colors[t.type]}`}
          >
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── Confirm Modal ────────────────────────────────────────────────
function ConfirmModal({ open, msg, onConfirm, onCancel, confirmLabel = 'Confirmer', danger = true }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <motion.div
        initial={{ scale: .93, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1325] p-8 text-center shadow-2xl"
      >
        <div className="text-2xl mb-2">{danger ? '⚠️' : '🏆'}</div>
        <p className="text-white/70 text-sm mb-6 whitespace-pre-line">{msg}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel}  className="admin-btn admin-btn-ghost">Annuler</button>
          <button onClick={onConfirm} className={danger ? 'admin-btn admin-btn-danger' : 'admin-btn admin-btn-primary'}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────
function Section({ title, accent = 'cyan', action, children }) {
  const colors = {
    cyan:   'text-cyan-300   border-cyan-400/20',
    amber:  'text-amber-300  border-amber-400/20',
    purple: 'text-purple-300 border-purple-400/20',
    green:  'text-green-300  border-green-400/20',
  }
  return (
    <section>
      <div className={`flex items-center justify-between pb-4 mb-6 border-b ${colors[accent]}`}>
        <h2 className={`text-2xl font-black tracking-wide uppercase ${colors[accent].split(' ')[0]}`}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

// ─── Field ────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-[2px] text-white/30 font-mono">{label}</span>
      {children}
    </div>
  )
}

// ─── Inline Input ─────────────────────────────────────────────────
function InlineInput({ value, onChange, type = 'text', placeholder }) {
  const [local, setLocal] = useState(value ?? '')
  const [dirty, setDirty] = useState(false)

  useEffect(() => { setLocal(value ?? ''); setDirty(false) }, [value])

  function handleChange(e) { setLocal(e.target.value); setDirty(true) }
  function handleBlur()    { if (dirty) { onChange(local); setDirty(false) } }
  function handleKey(e)    { if (e.key === 'Enter') e.target.blur() }

  return (
    <input
      type={type}
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKey}
      placeholder={placeholder}
      className={`
        w-full rounded-xl border px-3 py-2.5 text-sm font-medium
        bg-black/30 text-white outline-none transition-all
        placeholder:text-white/20
        ${dirty
          ? 'border-amber-400/50 shadow-[0_0_0_3px_rgba(251,191,36,0.08)]'
          : 'border-white/8 focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.06)]'}
      `}
    />
  )
}

// ─── Status Badge ─────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    upcoming:  'bg-amber-500/12  border-amber-400/25  text-amber-300',
    live:      'bg-green-500/12  border-green-400/25  text-green-300',
    completed: 'bg-purple-500/12 border-purple-400/25 text-purple-300',
  }
  const labels = { upcoming: '⏳ À venir', live: '🔴 Live', completed: '✅ Terminé' }
  return (
    <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border ${map[status] ?? map.upcoming}`}>
      {labels[status] ?? status}
    </span>
  )
}

// ─── PIN Screen ───────────────────────────────────────────────────
function PinScreen({ onSuccess }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function press(d) {
    if (input.length >= 4) return
    const next = input + d
    setInput(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (next === ADMIN_PIN) { onSuccess() }
        else { setError(true); setTimeout(() => { setInput(''); setError(false) }, 700) }
      }, 120)
    }
  }

  function back() { setInput(p => p.slice(0, -1)) }

  useEffect(() => {
    function onKey(e) {
      if (e.key >= '0' && e.key <= '9') press(e.key)
      if (e.key === 'Backspace') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl font-black text-center bg-gradient-to-r from-cyan-300 via-white to-amber-300 bg-clip-text text-transparent tracking-tight">
          ADMIN ACCESS
        </h1>
        <p className="text-center text-white/30 text-sm mt-2 font-mono tracking-widest uppercase">
          // Accès restreint
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: .95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: .1 }}
        className="rounded-3xl border border-white/8 bg-[#0d1325] p-10 w-80 shadow-2xl"
      >
        <div className="flex gap-4 justify-center mb-8">
          {[0,1,2,3].map(i => (
            <div key={i} className={`
              w-3.5 h-3.5 rounded-full border-2 transition-all duration-150
              ${i < input.length
                ? error
                  ? 'bg-red-400 border-red-400 shadow-[0_0_10px_rgba(248,113,113,.8)]'
                  : 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.7)]'
                : 'border-white/15 bg-transparent'}
            `} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => press(String(n))}
              className="rounded-xl bg-white/5 border border-white/8 py-4 text-xl font-bold text-white transition-all duration-100 hover:bg-cyan-500/15 hover:border-cyan-400/30 active:scale-90">
              {n}
            </button>
          ))}
          <div />
          <button onClick={() => press('0')}
            className="rounded-xl bg-white/5 border border-white/8 py-4 text-xl font-bold text-white transition-all duration-100 hover:bg-cyan-500/15 hover:border-cyan-400/30 active:scale-90">
            0
          </button>
          <button onClick={back}
            className="rounded-xl bg-white/5 border border-white/8 py-4 text-white/50 transition-all duration-100 hover:bg-white/8 active:scale-90 text-lg">
            ⌫
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Player Card ──────────────────────────────────────────────────
function PlayerCard({ player, onUpdate, onDelete, toast }) {
  const [badgeName, setBadgeName] = useState('')
  const [badgeIcon, setBadgeIcon] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function update(field, value) {
    const { error } = await supabase.from('players').update({ [field]: value }).eq('id', player.id)
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Sauvegardé ✓', 'success'); onUpdate() }
  }

  async function addBadge() {
    if (!badgeName || !badgeIcon) { toast('Nom et URL requis', 'error'); return }
    const updated = [...(player.badges || []), { name: badgeName, icon: badgeIcon }]
    const { error } = await supabase.from('players').update({ badges: updated }).eq('id', player.id)
    if (error) toast('Erreur: ' + error.message, 'error')
    else { setBadgeName(''); setBadgeIcon(''); toast('Badge ajouté !', 'success'); onUpdate() }
  }

  async function removeBadge(idx) {
    const updated = [...(player.badges || [])]
    updated.splice(idx, 1)
    const { error } = await supabase.from('players').update({ badges: updated }).eq('id', player.id)
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Badge supprimé', 'info'); onUpdate() }
  }

  const total   = player.wins + player.losses
  const winrate = total === 0 ? 0 : Math.round((player.wins / total) * 100)

  return (
    <>
      <ConfirmModal
        open={confirmOpen}
        msg={`Supprimer "${player.username}" ? Cette action est irréversible.`}
        onConfirm={async () => { setConfirmOpen(false); await onDelete(player.id) }}
        onCancel={() => setConfirmOpen(false)}
      />
      <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/8 bg-[#0d1325] p-6 space-y-5 hover:border-cyan-400/15 transition-colors">

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-sm font-black text-cyan-300">
              {player.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span className="font-black text-lg text-white">{player.username}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300">{player.elo} ELO</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-green-500/10 border border-green-400/20 text-green-300">{winrate}% WR</span>
          </div>
          <button onClick={() => setConfirmOpen(true)} className="admin-btn admin-btn-danger admin-btn-sm">🗑 Supprimer</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="Username"><InlineInput value={player.username} onChange={v => update('username', v)} placeholder="Username" /></Field>
          <Field label="ELO"><InlineInput type="number" value={player.elo} onChange={v => update('elo', parseInt(v))} /></Field>
          <Field label="Wins"><InlineInput type="number" value={player.wins} onChange={v => update('wins', parseInt(v))} /></Field>
          <Field label="Losses"><InlineInput type="number" value={player.losses} onChange={v => update('losses', parseInt(v))} /></Field>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[2px] text-white/25 font-mono mb-2">Monstres favoris</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1,2,3,4].map(n => (
              <InlineInput key={n} value={player[`monster_${n}`] || ''} onChange={v => update(`monster_${n}`, v || null)} placeholder={`Monster ${n}`} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[2px] text-white/25 font-mono mb-3">Badges</p>
          {(player.badges || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {(player.badges || []).map((badge, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-white/8 bg-black/20 pl-2 pr-1 py-1">
                  <img src={badge.icon} alt={badge.name} className="w-6 h-6 object-contain rounded" />
                  <span className="text-xs font-semibold text-white">{badge.name}</span>
                  <button onClick={() => removeBadge(i)} className="w-5 h-5 rounded-full flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs">×</button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <input value={badgeName} onChange={e => setBadgeName(e.target.value)} placeholder="Nom du badge" className="admin-input-plain flex-1" />
            <input value={badgeIcon} onChange={e => setBadgeIcon(e.target.value)} placeholder="URL de l'icône" className="admin-input-plain flex-1" />
            <button onClick={addBadge} className="admin-btn admin-btn-amber whitespace-nowrap">+ Badge</button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ─── Tournament Match Row ─────────────────────────────────────────
function TournamentMatchRow({ match, players, onUpdate, onDelete, toast }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function update(field, value) {
    const { error } = await supabase.from('tournament_matches').update({ [field]: value }).eq('id', match.id)
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Sauvegardé ✓', 'success'); onUpdate() }
  }

  const autoWinner = match.score1 > match.score2 ? match.player1
    : match.score2 > match.score1 ? match.player2
    : null

  return (
    <>
      <ConfirmModal
        open={confirmOpen}
        msg="Supprimer ce match de tournoi ?"
        onConfirm={async () => { setConfirmOpen(false); await onDelete(match.id) }}
        onCancel={() => setConfirmOpen(false)}
      />
      <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_80px_80px_1fr_40px] gap-2 items-end rounded-2xl border border-white/8 bg-[#0d1325] px-5 py-4 hover:border-amber-400/15 transition-colors">

        <Field label="Round">
          <InlineInput value={match.round || ''} onChange={v => update('round', v)} placeholder="ex: Final" />
        </Field>
        <Field label="Joueur 1">
          {players.length > 0 ? (
            <select value={match.player1 || ''} onChange={e => update('player1', e.target.value)}
              className="w-full rounded-xl border border-white/8 px-3 py-2.5 text-sm font-medium bg-black/30 text-white outline-none focus:border-cyan-400/40">
              <option value="">-- Joueur --</option>
              {players.map(p => <option key={p.id} value={p.username}>{p.username}</option>)}
            </select>
          ) : (
            <InlineInput value={match.player1 || ''} onChange={v => update('player1', v)} />
          )}
        </Field>
        <Field label="Joueur 2">
          {players.length > 0 ? (
            <select value={match.player2 || ''} onChange={e => update('player2', e.target.value)}
              className="w-full rounded-xl border border-white/8 px-3 py-2.5 text-sm font-medium bg-black/30 text-white outline-none focus:border-cyan-400/40">
              <option value="">-- Joueur --</option>
              {players.map(p => <option key={p.id} value={p.username}>{p.username}</option>)}
            </select>
          ) : (
            <InlineInput value={match.player2 || ''} onChange={v => update('player2', v)} />
          )}
        </Field>
        <Field label="Score J1">
          <InlineInput type="number" value={match.score1 ?? 0} onChange={v => update('score1', parseInt(v))} />
        </Field>
        <Field label="Score J2">
          <InlineInput type="number" value={match.score2 ?? 0} onChange={v => update('score2', parseInt(v))} />
        </Field>
        <Field label="Vainqueur">
          <div className={`px-3 py-2.5 rounded-xl border text-sm font-bold ${
            autoWinner ? 'border-green-400/20 bg-green-500/8 text-green-300' : 'border-white/8 text-white/30'
          }`}>
            {autoWinner ?? 'TBD'}
          </div>
        </Field>
        <div className="flex items-end pb-0.5">
          <button onClick={() => setConfirmOpen(true)}
            className="w-9 h-9 rounded-xl border border-red-500/20 bg-red-500/8 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center text-sm">
            🗑
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ─── Tournament Panel ─────────────────────────────────────────────
function TournamentPanel({ players, toast, onDataChange }) {
  const [tournaments,   setTournaments]   = useState([])
  const [selectedId,    setSelectedId]    = useState(null)
  const [tMatches,      setTMatches]      = useState([])
  const [newName,       setNewName]       = useState('')
  const [newDate,       setNewDate]       = useState('')
  const [pickedPlayers, setPickedPlayers] = useState([])
  const [confirm,       setConfirm]       = useState(null)
  const [finishOpen,    setFinishOpen]    = useState(false)
  const [finishWinner,  setFinishWinner]  = useState('')

  const selected = tournaments.find(t => t.id === selectedId)

  useEffect(() => { fetchTournaments() }, [])

  async function fetchTournaments() {
    const { data } = await supabase.from('tournaments').select('*').order('tournament_date', { ascending: false })
    setTournaments(data || [])
  }

  async function fetchMatches(tid) {
    const { data } = await supabase.from('tournament_matches').select('*').eq('tournament_id', tid).order('id')
    setTMatches(data || [])
  }

  function selectTournament(t) {
    setSelectedId(t.id)
    setPickedPlayers(t.participants || [])
    fetchMatches(t.id)
  }

  // ── Create ──────────────────────────────────────────────────────
  async function createTournament() {
    if (!newName.trim()) { toast('Nom requis', 'error'); return }
    const payload = { name: newName.trim(), status: 'upcoming', participants: [] }
    if (newDate) payload.tournament_date = new Date(newDate).toISOString()
    const { data, error } = await supabase.from('tournaments').insert([payload]).select().single()
    if (error) { toast('Erreur: ' + error.message, 'error'); return }
    toast(`"${newName}" créé !`, 'success')
    setNewName(''); setNewDate('')
    await fetchTournaments()
    selectTournament(data)
  }

  // ── Participants ────────────────────────────────────────────────
  function togglePlayer(username) {
    setPickedPlayers(prev =>
      prev.includes(username) ? prev.filter(p => p !== username) : [...prev, username]
    )
  }

  async function savePlayers() {
    const { error } = await supabase.from('tournaments').update({ participants: pickedPlayers }).eq('id', selectedId)
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Participants sauvegardés ✓', 'success'); fetchTournaments() }
  }

  // ── Start ───────────────────────────────────────────────────────
  async function startTournament() {
    if (!pickedPlayers.length) { toast('Ajoute au moins un joueur', 'error'); return }

    const { error: e1 } = await supabase.from('tournaments')
      .update({ status: 'live', participants: pickedPlayers })
      .eq('id', selectedId)
    if (e1) { toast('Erreur: ' + e1.message, 'error'); return }

    // Generate Round 1 match slots (pairs)
    const pairs = []
    for (let i = 0; i < pickedPlayers.length; i += 2) {
      pairs.push({
        tournament_id: selectedId,
        round: 'Round 1',
        player1: pickedPlayers[i],
        player2: pickedPlayers[i + 1] ?? 'BYE',
        score1: 0, score2: 0, winner: null,
      })
    }
    if (pairs.length) {
      const { error: e2 } = await supabase.from('tournament_matches').insert(pairs)
      if (e2) { toast('Erreur matchs: ' + e2.message, 'error'); return }
    }

    toast('🔴 Tournoi démarré !', 'success')
    await fetchTournaments()
    await fetchMatches(selectedId)
    onDataChange()
  }

  // ── Finish ──────────────────────────────────────────────────────
  async function finishTournament() {
    if (!finishWinner) { toast('Sélectionne le vainqueur', 'error'); return }

    const { error } = await supabase.from('tournaments')
      .update({ status: 'completed', winner: finishWinner })
      .eq('id', selectedId)
    if (error) { toast('Erreur: ' + error.message, 'error'); return }

    // Increment tournaments_won
    const wp = players.find(p => p.username === finishWinner)
    if (wp) {
      await supabase.from('players')
        .update({ tournaments_won: (wp.tournaments_won ?? 0) + 1 })
        .eq('id', wp.id)
    }

    toast('✅ Tournoi terminé !', 'success')
    setFinishOpen(false); setFinishWinner('')
    await fetchTournaments()
    onDataChange()
  }

  // ── Add match ───────────────────────────────────────────────────
  async function addMatch() {
    const { error } = await supabase.from('tournament_matches').insert([{
      tournament_id: selectedId,
      round: 'Round',
      player1: pickedPlayers[0] ?? '',
      player2: pickedPlayers[1] ?? '',
      score1: 0, score2: 0, winner: null,
    }])
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Match ajouté', 'success'); fetchMatches(selectedId) }
  }

  async function deleteMatch(id) {
    const { error } = await supabase.from('tournament_matches').delete().eq('id', id)
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Match supprimé', 'info'); fetchMatches(selectedId) }
  }

  // ── Delete tournament ───────────────────────────────────────────
  async function deleteTournament(id) {
    await supabase.from('tournament_matches').delete().eq('tournament_id', id)
    const { error } = await supabase.from('tournaments').delete().eq('id', id)
    if (error) toast('Erreur: ' + error.message, 'error')
    else {
      toast('Tournoi supprimé', 'info')
      setSelectedId(null); setTMatches([])
      fetchTournaments()
    }
  }

  const participantNames = players.map(p => p.username)

  return (
    <>
      {confirm && (
        <ConfirmModal
          open
          msg={confirm.msg}
          confirmLabel={confirm.label}
          danger={confirm.danger !== false}
          onConfirm={() => { confirm.onConfirm(); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Finish modal */}
      {finishOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <motion.div initial={{ scale: .93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1325] p-8 shadow-2xl">
            <div className="text-3xl text-center mb-4">🏆</div>
            <h3 className="text-lg font-black text-center text-white mb-6 uppercase tracking-wide">
              Terminer le tournoi
            </h3>
            <Field label="Vainqueur du tournoi">
              <select value={finishWinner} onChange={e => setFinishWinner(e.target.value)}
                className="w-full rounded-xl border border-white/8 px-3 py-2.5 text-sm font-medium bg-black/30 text-white outline-none focus:border-cyan-400/40">
                <option value="">-- Sélectionner --</option>
                {pickedPlayers.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setFinishOpen(false)} className="admin-btn admin-btn-ghost">Annuler</button>
              <button onClick={finishTournament} className="admin-btn admin-btn-primary">✅ Confirmer</button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* Left: list + create */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/8 bg-[#0d1325] p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[2px] text-white/30 font-mono">Nouveau tournoi</p>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Nom du tournoi" className="admin-input-plain w-full"
              onKeyDown={e => e.key === 'Enter' && createTournament()} />
            <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)}
              className="admin-input-plain w-full" />
            <button onClick={createTournament} className="admin-btn admin-btn-primary w-full justify-center">
              + Créer
            </button>
          </div>

          <div className="space-y-2">
            {tournaments.length === 0 && (
              <div className="text-center py-8 text-white/25 font-mono text-xs">Aucun tournoi</div>
            )}
            {tournaments.map(t => (
              <button key={t.id} onClick={() => selectTournament(t)}
                className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                  selectedId === t.id
                    ? 'border-cyan-400/30 bg-cyan-500/8'
                    : 'border-white/8 bg-[#0d1325] hover:border-white/15'
                }`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-white truncate">{t.name}</span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="text-xs text-white/30 font-mono">
                  {t.tournament_date
                    ? new Date(t.tournament_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Date non définie'}
                  {t.participants?.length ? ` • ${t.participants.length} joueurs` : ''}
                </div>
                {t.winner && <div className="text-xs text-amber-300 mt-1">🏆 {t.winner}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Right: detail */}
        {!selected ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 text-white/20 font-mono text-sm min-h-[300px]">
            Sélectionne ou crée un tournoi
          </div>
        ) : (
          <div className="space-y-5">

            {/* Header card */}
            <div className="rounded-2xl border border-white/8 bg-[#0d1325] p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-xl font-black text-white">{selected.name}</h3>
                    <StatusBadge status={selected.status} />
                  </div>
                  {selected.tournament_date && (
                    <p className="text-xs text-white/30 font-mono">
                      📅 {new Date(selected.tournament_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  {selected.winner && (
                    <p className="text-sm text-amber-300 font-bold mt-2">🏆 Vainqueur : {selected.winner}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {selected.status === 'upcoming' && (
                    <button
                      onClick={() => setConfirm({
                        msg: `Démarrer "${selected.name}" ?\n${pickedPlayers.length} joueur(s) inscrit(s).\n\nLes matchs du Round 1 seront générés automatiquement.`,
                        label: '🔴 Démarrer',
                        danger: false,
                        onConfirm: startTournament,
                      })}
                      className="admin-btn admin-btn-primary"
                    >
                      🔴 Démarrer
                    </button>
                  )}
                  {selected.status === 'live' && (
                    <button onClick={() => setFinishOpen(true)} className="admin-btn admin-btn-amber">
                      ✅ Terminer
                    </button>
                  )}
                  <button
                    onClick={() => setConfirm({
                      msg: `Supprimer "${selected.name}" et tous ses matchs ?`,
                      label: 'Supprimer',
                      danger: true,
                      onConfirm: () => deleteTournament(selected.id),
                    })}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>

            {/* Participants */}
            {selected.status !== 'completed' && (
              <div className="rounded-2xl border border-white/8 bg-[#0d1325] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[2px] text-white/30 font-mono">
                    Participants ({pickedPlayers.length})
                  </p>
                  <button onClick={savePlayers} className="admin-btn admin-btn-primary admin-btn-sm">
                    💾 Sauvegarder
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {participantNames.map(username => {
                    const active = pickedPlayers.includes(username)
                    return (
                      <button key={username} onClick={() => togglePlayer(username)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          active
                            ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                            : 'bg-white/4 border-white/8 text-white/40 hover:border-white/20 hover:text-white/70'
                        }`}>
                        {active ? '✓ ' : ''}{username}
                      </button>
                    )
                  })}
                </div>

                {pickedPlayers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5">
                    {pickedPlayers.map((p, i) => (
                      <span key={p} className="text-xs font-mono text-white/40">
                        {i + 1}. {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Matches */}
            {(selected.status === 'live' || selected.status === 'completed') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[2px] text-white/30 font-mono">
                    Matchs ({tMatches.length})
                  </p>
                  {selected.status === 'live' && (
                    <button onClick={addMatch} className="admin-btn admin-btn-amber admin-btn-sm">
                      + Match
                    </button>
                  )}
                </div>

                {tMatches.length === 0 ? (
                  <div className="text-center py-8 text-white/20 font-mono text-xs">Aucun match</div>
                ) : (
                  tMatches.map(m => (
                    <TournamentMatchRow
                      key={m.id}
                      match={m}
                      players={players.filter(p => pickedPlayers.includes(p.username))}
                      onUpdate={() => fetchMatches(selectedId)}
                      onDelete={deleteMatch}
                      toast={toast}
                    />
                  ))
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────
export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [players, setPlayers]             = useState([])
  const [matches, setMatches]             = useState([])
  const [tab, setTab]                     = useState('players')
  const [search, setSearch]               = useState('')
  const { toasts, push: toast }           = useToast()

  useEffect(() => {
    if (sessionStorage.getItem('lockin_admin') === 'true') {
      setAuthenticated(true)
      fetchData()
    }
  }, [])

  async function fetchData() {
    const { data: pd } = await supabase.from('players').select('*').order('elo', { ascending: false })
    const { data: md } = await supabase.from('tournament_matches').select('*')
    setPlayers(Array.isArray(pd) ? pd : [])
    setMatches(Array.isArray(md) ? md : [])
  }

  function handleLogin() {
    sessionStorage.setItem('lockin_admin', 'true')
    setAuthenticated(true)
    fetchData()
  }

  function logout() {
    sessionStorage.removeItem('lockin_admin')
    setAuthenticated(false)
  }

  async function addPlayer() {
    const { error } = await supabase.from('players').insert([{
      username: 'New Player', elo: 1000, wins: 0, losses: 0,
      monster_1: '', monster_2: '', monster_3: '', monster_4: '',
    }])
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Joueur ajouté !', 'success'); fetchData() }
  }

  async function deletePlayer(id) {
    const { error } = await supabase.from('players').delete().eq('id', id)
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Joueur supprimé', 'info'); fetchData() }
  }

  async function addMatch() {
    const { error } = await supabase.from('tournament_matches').insert([{
      round: 'Round', player1: '', player2: '', score1: 0, score2: 0, winner: null,
    }])
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Match ajouté !', 'success'); fetchData() }
  }

  async function deleteMatch(id) {
    const { error } = await supabase.from('tournament_matches').delete().eq('id', id)
    if (error) toast('Erreur: ' + error.message, 'error')
    else { toast('Match supprimé', 'info'); fetchData() }
  }

  if (!authenticated) return <PinScreen onSuccess={handleLogin} />

  const filteredPlayers = players.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  )

  const tabs = [
    { id: 'players',     label: '👤 Joueurs',   count: players.length },
    { id: 'matches',     label: '🎯 Matchs',     count: matches.length },
    { id: 'tournaments', label: '🏆 Tournois',   count: null },
  ]

  return (
    <>
      <ToastStack toasts={toasts} />

      <style>{`
        .admin-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 18px; border-radius: 10px;
          font-size: 13px; font-weight: 700; letter-spacing: .5px;
          cursor: pointer; transition: all .15s; border: none;
          font-family: inherit;
        }
        .admin-btn-sm { padding: 6px 12px; font-size: 12px; }
        .admin-btn-primary { background: linear-gradient(135deg,#22d3ee,#0ea5e9); color: #04060e; }
        .admin-btn-primary:hover { opacity:.88; transform:translateY(-1px); }
        .admin-btn-ghost { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: #e2e8f0; }
        .admin-btn-ghost:hover { background: rgba(255,255,255,.09); }
        .admin-btn-danger { background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.25); color: #f87171; }
        .admin-btn-danger:hover { background: rgba(248,113,113,.2); }
        .admin-btn-amber { background: linear-gradient(135deg,#fbbf24,#f97316); color: #04060e; }
        .admin-btn-amber:hover { opacity:.88; }
        .admin-input-plain {
          background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px; color: #e2e8f0; font-size: 13px; font-weight: 500;
          padding: 9px 13px; outline: none; transition: border-color .15s; width: 100%;
        }
        .admin-input-plain::placeholder { color: rgba(255,255,255,.2); }
        .admin-input-plain:focus { border-color: rgba(34,211,238,.4); box-shadow: 0 0 0 3px rgba(34,211,238,.06); }
        select option { background: #0d1325; }
        .admin-btn.w-full { width: 100%; }
      `}</style>

      <div className="max-w-5xl mx-auto pb-20 space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-white/8">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-white to-amber-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-white/30 text-sm font-mono mt-1 tracking-widest">// Lockin Blitz</p>
          </div>
          <button onClick={logout} className="admin-btn admin-btn-danger">🔒 Déconnexion</button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-white/4 border border-white/8 rounded-2xl p-1.5 w-fit flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch('') }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                tab === t.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/40 hover:text-white/70'
              }`}>
              {t.label}
              {t.count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                  tab === t.id ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/8 text-white/30'
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── PLAYERS ── */}
        {tab === 'players' && (
          <Section title="Joueurs" accent="cyan"
            action={<button onClick={addPlayer} className="admin-btn admin-btn-primary">+ Ajouter</button>}>
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un joueur..." className="admin-input-plain pl-10 w-full max-w-sm" />
            </div>
            <AnimatePresence>
              {filteredPlayers.length === 0
                ? <div className="text-center py-16 text-white/25 font-mono text-sm">{search ? 'Aucun résultat' : 'Aucun joueur'}</div>
                : <div className="space-y-3">{filteredPlayers.map(p => (
                    <PlayerCard key={p.id} player={p} onUpdate={fetchData} onDelete={deletePlayer} toast={toast} />
                  ))}</div>
              }
            </AnimatePresence>
          </Section>
        )}

        {/* ── MATCHES ── */}
        {tab === 'matches' && (
          <Section title="Matchs Tournoi" accent="amber"
            action={<button onClick={addMatch} className="admin-btn admin-btn-amber">+ Ajouter</button>}>
            <AnimatePresence>
              {matches.length === 0
                ? <div className="text-center py-16 text-white/25 font-mono text-sm">Aucun match de tournoi</div>
                : <div className="space-y-2">{matches.map(m => (
                    <TournamentMatchRow key={m.id} match={m} players={players}
                      onUpdate={fetchData} onDelete={deleteMatch} toast={toast} />
                  ))}</div>
              }
            </AnimatePresence>
          </Section>
        )}

        {/* ── TOURNAMENTS ── */}
        {tab === 'tournaments' && (
          <Section title="Tournois" accent="purple">
            <TournamentPanel players={players} toast={toast} onDataChange={fetchData} />
          </Section>
        )}

      </div>
    </>
  )
}