import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useTeams } from '@/hooks/useTeams'
import { useTeamAdmin } from '@/hooks/useTeamAdmin'
import type { GameTitle } from '@/types'

const inputClass = 'w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-sm px-3 py-2 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint'
const labelClass = 'font-mono text-[10px] tracking-[2px] uppercase text-gh-muted'
const GAMES: GameTitle[] = ['Valorant', 'FIFA 25', 'Call of Duty: MW3', 'eFootball', 'Mortal Kombat 1', 'Street Fighter 6']

function NewTeamForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [game, setGame] = useState<GameTitle>('Valorant')
  const [captainUsername, setCaptainUsername] = useState('')
  const [description, setDescription] = useState('')
  const { createTeam, isSaving, error, success } = useTeamAdmin()

  const handleSubmit = async () => {
    const result = await createTeam({ name, tag, game, description, captainUsername })
    if (result) {
      setName(''); setTag(''); setCaptainUsername(''); setDescription('')
      setOpen(false)
      onCreated()
    }
  }

  if (!open) {
    return <Button variant="gold" size="lg" onClick={() => setOpen(true)}>+ New Team</Button>
  }

  return (
    <div className="bg-gh-card border border-gh-border p-5 clip-md flex flex-col gap-4 w-full sm:w-auto sm:min-w-[420px]">
      <p className="font-bebas text-lg tracking-widest text-gh-text">CREATE TEAM</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1"><label className={labelClass}>Team Name</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} /></div>
        <div className="flex flex-col gap-1"><label className={labelClass}>Tag</label><input value={tag} onChange={e => setTag(e.target.value.toUpperCase())} maxLength={5} className={inputClass} /></div>
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Game</label>
        <select value={game} onChange={e => setGame(e.target.value as GameTitle)} className={inputClass}>
          {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Captain's Username</label>
        <input value={captainUsername} onChange={e => setCaptainUsername(e.target.value)} placeholder="Must already have an account" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={inputClass} />
      </div>

      {error && <p className="font-rajdhani text-xs text-gh-red">{error}</p>}
      {success && <p className="font-rajdhani text-xs text-green-500">{success}</p>}

      <div className="flex gap-2">
        <Button variant="gold" size="sm" disabled={isSaving || !name.trim() || !tag.trim() || !captainUsername.trim()} onClick={handleSubmit}>
          {isSaving ? 'Creating…' : 'Create Team'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  )
}

export function AdminTeamsPage() {
  const { data: teams, loading, error, refetch } = useTeams()
  const { deleteTeam, isSaving } = useTeamAdmin()

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Remove team "${name}"? This cannot be undone.`)) return
    const ok = await deleteTeam(id)
    if (ok) refetch()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="border-l-[3px] border-gh-gold pl-5">
              <p className="section-label text-gh-gold">// ADMIN</p>
              <h1 className="font-bebas text-gh-text leading-none" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                MANAGE TEAMS
              </h1>
            </div>
            <NewTeamForm onCreated={refetch} />
          </div>

          <div className="bg-gh-card border border-gh-border overflow-hidden">
            <div className="grid px-4 py-3 bg-gh-card2 border-b border-gh-border" style={{ gridTemplateColumns: '1fr 120px 80px 80px 100px', gap: '8px' }}>
              {['Team', 'Game', 'Wins', 'Losses', ''].map((h, i) => (
                <span key={i} className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint font-bold">{h}</span>
              ))}
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorState message={error} onRetry={refetch} />}

            {!loading && !error && teams?.map(team => (
              <div key={team.id} className="grid items-center px-4 py-3 border-b border-gh-border last:border-b-0 hover:bg-gh-card2 transition-colors" style={{ gridTemplateColumns: '1fr 120px 80px 80px 100px', gap: '8px' }}>
                <div className="font-rajdhani font-bold text-sm text-gh-text truncate">{team.name} <span className="text-gh-faint">[{team.tag}]</span></div>
                <span className="font-mono text-[10px] text-gh-muted uppercase truncate">{team.game}</span>
                <span className="font-mono text-xs text-green-500">{team.wins}</span>
                <span className="font-mono text-xs text-gh-red">{team.losses}</span>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" disabled={isSaving} onClick={() => handleDelete(team.id, team.name)}>Remove</Button>
                </div>
              </div>
            ))}

            {!loading && !error && teams?.length === 0 && (
              <div className="text-center py-16"><p className="font-bebas text-2xl text-gh-muted tracking-widest">NO TEAMS YET</p></div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}