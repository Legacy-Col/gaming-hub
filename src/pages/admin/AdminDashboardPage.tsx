import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useArticles } from '@/hooks/useArticles'
import { useArticleEditor } from '@/hooks/useArticleEditor'
import { useAuthContext } from '@/context/AuthContext'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AdminDashboardPage() {
  const { user } = useAuthContext()
  const { data: articles, loading, error, refetch } = useArticles()
  const { deleteArticle, isSaving } = useArticleEditor()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const navigate = useNavigate()

  const published = articles?.filter(a => a.status === 'published').length ?? 0
  const drafts = articles?.filter(a => a.status === 'draft').length ?? 0

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    const ok = await deleteArticle(id)
    if (ok) refetch()
    setDeletingId(null)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="border-l-[3px] border-gh-gold pl-5">
              <p className="section-label text-gh-gold">// ADMIN ONLY</p>
              <h1 className="font-bebas text-gh-text leading-none" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                ADMIN DASHBOARD
              </h1>
              <p className="font-rajdhani text-sm text-gh-muted mt-2">
                Signed in as <span className="text-gh-text font-semibold">{user?.username}</span> (admin)
              </p>
            </div>
            <Link to="/admin/articles/new">
              <Button variant="gold" size="lg">+ Write New Article</Button>
            </Link>
          </div>

          {/* Management shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/admin/tournaments" className="bg-gh-card border border-gh-border p-5 clip-md transition-all duration-200 hover:border-gh-red hover:-translate-y-1">
              <div className="font-bebas text-xl tracking-widest text-gh-text mb-1">🏆 TOURNAMENTS</div>
              <p className="font-rajdhani text-sm text-gh-muted">Create tournaments, edit details, and set regulations.</p>
            </Link>
            <Link to="/admin/store" className="bg-gh-card border border-gh-border p-5 clip-md transition-all duration-200 hover:border-gh-purple hover:-translate-y-1">
              <div className="font-bebas text-xl tracking-widest text-gh-text mb-1">🎮 STORE</div>
              <p className="font-rajdhani text-sm text-gh-muted">Add, edit, or remove gear and merch listings.</p>
            </Link>
            <Link to="/admin/teams" className="bg-gh-card border border-gh-border p-5 clip-md transition-all duration-200 hover:border-gh-gold hover:-translate-y-1">
              <div className="font-bebas text-xl tracking-widest text-gh-text mb-1">⚔ TEAMS</div>
              <p className="font-rajdhani text-sm text-gh-muted">Create teams on behalf of captains, or remove any team.</p>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-gh-card border border-gh-border p-5 clip-md">
              <div className="font-bebas text-3xl text-gh-purple">{articles?.length ?? 0}</div>
              <div className="font-mono text-[10px] tracking-widest text-gh-faint uppercase mt-1">Total Articles</div>
            </div>
            <div className="bg-gh-card border border-gh-border p-5 clip-md">
              <div className="font-bebas text-3xl text-green-500">{published}</div>
              <div className="font-mono text-[10px] tracking-widest text-gh-faint uppercase mt-1">Published</div>
            </div>
            <div className="bg-gh-card border border-gh-border p-5 clip-md">
              <div className="font-bebas text-3xl text-gh-red">{drafts}</div>
              <div className="font-mono text-[10px] tracking-widest text-gh-faint uppercase mt-1">Drafts</div>
            </div>
          </div>

          {/* Article management table */}
          <div className="bg-gh-card border border-gh-border overflow-hidden">
            <div className="grid px-4 py-3 bg-gh-card2 border-b border-gh-border"
              style={{ gridTemplateColumns: '1fr 100px 120px 160px', gap: '8px' }}>
              {['Title', 'Status', 'Published', ''].map((h, i) => (
                <span key={i} className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint font-bold">
                  {h}
                </span>
              ))}
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorState message={error} onRetry={refetch} />}

            {!loading && !error && articles?.map(article => (
              <div
                key={article.id}
                className="grid items-center px-4 py-3 border-b border-gh-border last:border-b-0 hover:bg-gh-card2 transition-colors"
                style={{ gridTemplateColumns: '1fr 100px 120px 160px', gap: '8px' }}
              >
                <Link to={`/articles/${article.slug}`} className="font-rajdhani font-bold text-sm text-gh-text hover:text-gh-purple truncate">
                  {article.title}
                </Link>
                <span className={`font-mono text-[10px] tracking-widest uppercase ${article.status === 'published' ? 'text-green-500' : 'text-gh-red'}`}>
                  {article.status}
                </span>
                <span className="font-mono text-xs text-gh-muted">{formatDate(article.publishedAt)}</span>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/articles/${article.slug}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSaving && deletingId === article.id}
                    onClick={() => handleDelete(article.id, article.title)}
                  >
                    {isSaving && deletingId === article.id ? '…' : 'Delete'}
                  </Button>
                </div>
              </div>
            ))}

            {!loading && !error && articles?.length === 0 && (
              <div className="text-center py-16">
                <p className="font-bebas text-2xl text-gh-muted tracking-widest">NO ARTICLES YET</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}