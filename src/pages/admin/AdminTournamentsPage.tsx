import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useTournaments } from '@/hooks/useTournaments'
import { useTournamentAdmin } from '@/hooks/useTournamentAdmin'

export function AdminTournamentsPage() {
  const { data: tournaments, loading, error, refetch } = useTournaments()
  const { deleteTournament, isSaving } = useTournamentAdmin()
  const navigate = useNavigate()

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    const ok = await deleteTournament(id)
    if (ok) refetch()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="border-l-[3px] border-gh-red pl-5">
              <p className="section-label text-gh-red">// ADMIN</p>
              <h1 className="font-bebas text-gh-text leading-none" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                MANAGE TOURNAMENTS
              </h1>
            </div>
            <Link to="/admin/tournaments/new">
              <Button variant="gold" size="lg">+ New Tournament</Button>
            </Link>
          </div>

          <div className="bg-gh-card border border-gh-border overflow-hidden">
            <div className="grid px-4 py-3 bg-gh-card2 border-b border-gh-border" style={{ gridTemplateColumns: '1fr 100px 100px 120px 160px', gap: '8px' }}>
              {['Title', 'Status', 'Teams', 'Starts', ''].map((h, i) => (
                <span key={i} className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint font-bold">{h}</span>
              ))}
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorState message={error} onRetry={refetch} />}

            {!loading && !error && tournaments?.map(t => (
              <div key={t.id} className="grid items-center px-4 py-3 border-b border-gh-border last:border-b-0 hover:bg-gh-card2 transition-colors" style={{ gridTemplateColumns: '1fr 100px 100px 120px 160px', gap: '8px' }}>
                <div>
                  <div className="font-rajdhani font-bold text-sm text-gh-text truncate">{t.title}</div>
                  <div className="font-mono text-[10px] text-gh-faint">{t.game}</div>
                </div>
                <span className={`font-mono text-[10px] tracking-widest uppercase ${
                  t.status === 'live' ? 'text-gh-red' : t.status === 'upcoming' ? 'text-gh-gold' : 'text-gh-muted'
                }`}>{t.status}</span>
                <span className="font-mono text-xs text-gh-muted">{t.registeredTeams}/{t.maxTeams}</span>
                <span className="font-mono text-xs text-gh-muted">{new Date(t.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/tournaments/${t.id}/edit`)}>Edit</Button>
                  <Button variant="outline" size="sm" disabled={isSaving} onClick={() => handleDelete(t.id, t.title)}>Delete</Button>
                </div>
              </div>
            ))}

            {!loading && !error && tournaments?.length === 0 && (
              <div className="text-center py-16"><p className="font-bebas text-2xl text-gh-muted tracking-widest">NO TOURNAMENTS YET</p></div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}