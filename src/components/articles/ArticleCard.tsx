import { Link } from 'react-router-dom'
import type { Article } from '@/types'

function formatDate(iso: string | null) {
  if (!iso) return 'Draft'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group block bg-gh-card border border-gh-border clip-md overflow-hidden transition-all duration-200 hover:border-gh-purple hover:-translate-y-1"
    >
      <div className="aspect-[16/9] bg-gh-card2 overflow-hidden">
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-bebas text-4xl text-gh-faint tracking-widest">GH</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {article.tags.slice(0, 2).map(tag => (
            <span key={tag} className="font-mono text-[10px] tracking-widest text-gh-gold uppercase">
              #{tag}
            </span>
          ))}
          {article.status === 'draft' && (
            <span className="font-mono text-[10px] tracking-widest text-gh-red uppercase border border-gh-red px-1.5 py-0.5">
              Draft
            </span>
          )}
        </div>

        <h3 className="font-bebas text-xl md:text-2xl tracking-wide text-gh-text leading-tight mb-2 group-hover:text-gh-purple transition-colors">
          {article.title}
        </h3>
        <p className="font-rajdhani text-sm text-gh-muted leading-relaxed line-clamp-2 mb-4">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between font-mono text-[10px] text-gh-faint tracking-widest uppercase">
          <span>{article.authorName}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}