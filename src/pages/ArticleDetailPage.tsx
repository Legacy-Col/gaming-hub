import { useParams, Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Button } from '@/components/ui/Button'
import { useArticle } from '@/hooks/useArticle'
import { useArticleEditor } from '@/hooks/useArticleEditor'
import { useAuthContext } from '@/context/AuthContext'

function formatDate(iso: string | null) {
  if (!iso) return 'Unpublished draft'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ArticleDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: article, loading, error, refetch } = useArticle(slug)
  const { user } = useAuthContext()
  const { deleteArticle, isSaving } = useArticleEditor()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const handleDelete = async () => {
    if (!article) return
    if (!window.confirm('Delete this article? This cannot be undone.')) return
    const ok = await deleteArticle(article.id)
    if (ok) navigate('/articles')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">

          <Link to="/articles" className="font-mono text-xs tracking-widest text-gh-muted hover:text-gh-gold transition-colors">
            ← BACK TO ARTICLES
          </Link>

          {loading && <LoadingSpinner />}
          {error && <ErrorState message={error} onRetry={refetch} />}

          {!loading && !error && article && (
            <>
              {isAdmin && (
                <div className="flex gap-3 border border-gh-border bg-gh-card p-3 clip-sm">
                  <Link to={`/admin/articles/${article.slug}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleDelete} disabled={isSaving}>
                    {isSaving ? 'Deleting…' : 'Delete'}
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {article.tags.map(tag => (
                  <span key={tag} className="font-mono text-[10px] tracking-widest text-gh-gold uppercase">#{tag}</span>
                ))}
                {article.status === 'draft' && (
                  <span className="font-mono text-[10px] tracking-widest text-gh-red uppercase border border-gh-red px-1.5 py-0.5">
                    Draft — not visible to the public
                  </span>
                )}
              </div>

              <h1 className="font-bebas tracking-wide leading-none text-gh-text" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                {article.title}
              </h1>

              <div className="flex items-center gap-3 font-mono text-xs text-gh-faint tracking-widest uppercase pb-6 border-b border-gh-border">
                <span>{article.authorName}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              {article.coverImageUrl && (
                <img src={article.coverImageUrl} alt={article.title} className="w-full clip-md object-cover" />
              )}

              {/*
                Content is authored exclusively by admins through the rich text editor,
                so this is trusted content — not raw user input. The backend should still
                sanitize HTML server-side on save as defense in depth.
              */}
              <div
                className="prose prose-invert max-w-none font-rajdhani text-gh-text leading-relaxed [&_h2]:font-bebas [&_h2]:tracking-wide [&_h2]:text-2xl [&_h3]:font-bebas [&_h3]:tracking-wide [&_h3]:text-xl [&_blockquote]:border-l-2 [&_blockquote]:border-gh-gold [&_blockquote]:pl-4 [&_blockquote]:text-gh-muted [&_a]:text-gh-gold"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}