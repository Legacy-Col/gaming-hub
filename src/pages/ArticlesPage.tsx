import { useState, useMemo } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Button } from '@/components/ui/Button'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { useArticles } from '@/hooks/useArticles'
import { useAuthContext } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

export function ArticlesPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const { data: articles, loading, error, refetch } = useArticles(activeTag ? { tag: activeTag } : {})
  const { user } = useAuthContext()
  const isAdmin = user?.role === 'admin'

  const tags = useMemo(() => {
    const all = new Set<string>()
    articles?.forEach(a => a.tags.forEach(t => all.add(t)))
    return Array.from(all)
  }, [articles])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="border-l-[3px] border-gh-purple pl-5">
              <p className="section-label text-gh-purple">// NEWS & STORIES</p>
              <h1 className="font-bebas text-gh-text leading-none" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
                ARTICLES
              </h1>
            </div>

            {isAdmin && (
              <Link to="/admin/articles/new">
                <Button variant="gold" size="md">+ Write Article</Button>
              </Link>
            )}
          </div>

          {/* Tag filters */}
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTag(null)}
                className={[
                  'font-bebas tracking-widest text-sm px-4 py-1.5 border clip-sm transition-colors',
                  activeTag === null
                    ? 'border-gh-gold text-gh-gold bg-gh-gold/8'
                    : 'border-gh-border text-gh-muted hover:border-gh-gold hover:text-gh-gold',
                ].join(' ')}
              >
                All
              </button>
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={[
                    'font-bebas tracking-widest text-sm px-4 py-1.5 border clip-sm transition-colors',
                    activeTag === tag
                      ? 'border-gh-gold text-gh-gold bg-gh-gold/8'
                      : 'border-gh-border text-gh-muted hover:border-gh-gold hover:text-gh-gold',
                  ].join(' ')}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {loading && <LoadingSpinner />}
          {error && <ErrorState message={error} onRetry={refetch} />}

          {!loading && !error && articles && (
            articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-bebas text-2xl text-gh-muted tracking-widest">NO ARTICLES YET</p>
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}