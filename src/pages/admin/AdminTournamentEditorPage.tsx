import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useTournamentDetail } from '@/hooks/useTournamentDetails'
import { useTournamentAdmin } from '@/hooks/useTournamentAdmin'
import type { TournamentFormat, GameTitle } from '@/types'

const inputClass = 'w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint'
const labelClass = 'font-mono text-[11px] tracking-[2px] uppercase text-gh-muted'
const GAMES: GameTitle[] = ['Valorant', 'FIFA 25', 'Call of Duty: MW3', 'eFootball', 'Mortal Kombat 1', 'Street Fighter 6']
const FORMATS: TournamentFormat[] = ['bracket', 'round-robin', 'league']

export function AdminTournamentEditorPage() {
  const { id } = useParams<{ id?: string }>()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const { data: existing, loading: loadingExisting } = useTournamentDetail(id ?? '', isEditMode)
  const { createTournament, updateTournament, isSaving, error, success } = useTournamentAdmin()

  const [title, setTitle] = useState('')
  const [game, setGame] = useState<GameTitle>('Valorant')
  const [prizePool, setPrizePool] = useState('')
  const [entryFee, setEntryFee] = useState('')
  const [tokenCost, setTokenCost] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [maxTeams, setMaxTeams] = useState('16')
  const [format, setFormat] = useState<TournamentFormat>('bracket')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState<string[]>([''])

  useEffect(() => {
    if (isEditMode && existing) {
      setTitle(existing.title)
      setGame(existing.game)
      setPrizePool(existing.prizePool)
      setEntryFee(existing.entryFee ?? '')
      setTokenCost(existing.tokenCost?.toString() ?? '')
      setStartDate(existing.startDate.slice(0, 10))
      setEndDate(existing.endDate?.slice(0, 10) ?? '')
      setMaxTeams(existing.maxTeams.toString())
      setFormat(existing.format)
      setImageUrl(existing.imageUrl ?? '')
      setDescription(existing.description)
      setRules(existing.rules.length ? existing.rules : [''])
    }
  }, [isEditMode, existing])

  const updateRule = (i: number, value: string) => setRules(r => r.map((rule, idx) => (idx === i ? value : rule)))
  const addRule = () => setRules(r => [...r, ''])
  const removeRule = (i: number) => setRules(r => r.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    const payload = {
      title,
      game,
      prizePool,
      entryFee: entryFee || null,
      tokenCost: tokenCost ? Number(tokenCost) : undefined,
      startDate,
      endDate: endDate || undefined,
      maxTeams: Number(maxTeams),
      format,
      imageUrl: imageUrl || undefined,
      description,
      rules: rules.map(r => r.trim()).filter(Boolean),
    }

    if (isEditMode && existing) {
      await updateTournament(existing.id, payload)
      navigate('/admin/tournaments')
    } else {
      const result = await createTournament(payload)
      if (result) navigate('/admin/tournaments')
    }
  }

  if (isEditMode && loadingExisting) {
    return <><Navbar /><main className="min-h-screen bg-gh-bg pt-24"><LoadingSpinner /></main><Footer /></>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="border-l-[3px] border-gh-gold pl-5">
            <p className="section-label text-gh-gold">// ADMIN</p>
            <h1 className="font-bebas text-gh-text leading-none" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              {isEditMode ? 'EDIT TOURNAMENT' : 'NEW TOURNAMENT'}
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Lagos Open Season 4" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Game</label>
              <select value={game} onChange={e => setGame(e.target.value as GameTitle)} className={inputClass}>
                {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Format</label>
              <select value={format} onChange={e => setFormat(e.target.value as TournamentFormat)} className={inputClass}>
                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Prize Pool</label>
              <input value={prizePool} onChange={e => setPrizePool(e.target.value)} placeholder="₦500,000" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Entry Fee</label>
              <input value={entryFee} onChange={e => setEntryFee(e.target.value)} placeholder="Free or ₦1,000" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Token Cost</label>
              <input type="number" value={tokenCost} onChange={e => setTokenCost(e.target.value)} placeholder="0" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Max Teams</label>
              <input type="number" value={maxTeams} onChange={e => setMaxTeams(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Cover Image URL</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" className={inputClass} />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputClass} />
          </div>

          {/* Regulations / rules */}
          <div className="flex flex-col gap-3">
            <label className={labelClass}>Regulations</label>
            {rules.map((rule, i) => (
              <div key={i} className="flex gap-2">
                <span className="font-mono text-xs text-gh-faint pt-3 w-6">{i + 1}.</span>
                <input
                  value={rule}
                  onChange={e => updateRule(i, e.target.value)}
                  placeholder="e.g. Best of 3, single elimination"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeRule(i)}
                  className="font-mono text-gh-red px-3 hover:text-gh-red/70"
                  title="Remove rule"
                >
                  ✕
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addRule}>+ Add Rule</Button>
          </div>

          {error && <p className="font-rajdhani text-sm text-gh-red">{error}</p>}
          {success && <p className="font-rajdhani text-sm text-green-500">{success}</p>}

          <div className="flex gap-3 pt-2 border-t border-gh-border">
            <Button variant="gold" size="lg" disabled={isSaving || !title.trim()} onClick={handleSave}>
              {isSaving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Tournament'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}