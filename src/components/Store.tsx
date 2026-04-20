import { useState } from 'react'
import { useStore } from '@/hooks/useStore'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { ErrorState } from './ui/ErrorState'
import { TokenBadge } from './ui/TokenBadge'
import { Button } from './ui/Button'
import type { StoreCategory } from '@/types'
import { Link } from 'react-router-dom'

const CATEGORIES: { label: string; value: StoreCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Gaming Gear', value: 'gaming-gear' },
  { label: 'Anime Merch', value: 'anime-merch' },
]

export function Store() {
  const [cat, setCat] = useState<StoreCategory | 'all'>('all')
  const { data: items, loading, error, refetch } = useStore(
    cat === 'all' ? {} : { category: cat },
  )

  return (
    <section id="store" className="px-4 md:px-12 py-20 md:py-28">
      <div className="border-l-[3px] border-gh-red pl-5 mb-10">
        <p className="section-label text-gh-red">// THE FORGE STORE</p>
        <h2 className="section-heading text-4xl md:text-5xl lg:text-6xl">
          GEAR UP.<br />
          <span className="text-gh-muted">GAMING &amp; ANIME MERCH</span>
        </h2>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <Link to='/store'>
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={[
                'flex-shrink-0 font-mono text-xs px-3 py-1.5 border transition-colors duration-150',
                cat === c.value
                  ? 'border-gh-red text-gh-red bg-[rgba(255,34,0,0.08)]'
                  : 'border-gh-border text-gh-muted hover:border-gh-faint',
              ].join(' ')}
            >
              {c.label}
            </button>
          </Link>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorState onRetry={refetch} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items?.map(item => (
            <div key={item.id} className="store-card">
              {/* Image area */}
              <div className="h-36 md:h-44 bg-gh-card2 flex items-center justify-center
                              text-5xl border-b border-gh-border relative">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name} className="w-34 h-34 object-cover" />
                  : item.emoji
                }
                {!item.inStock && (
                  <div className="absolute inset-0 bg-gh-bg/70 flex items-center justify-center">
                    <span className="font-mono text-[10px] tracking-widest text-gh-faint border border-gh-border px-2 py-1">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <div className="text-[10px] tracking-[2px] uppercase text-gh-faint font-bold mb-1">
                    {item.category === 'gaming-gear' ? 'Gaming Gear' : 'Anime Merch'}
                  </div>
                  <div className="font-rajdhani font-bold text-sm md:text-base text-gh-text leading-snug">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-gh-gold text-xs">{'★'.repeat(Math.round(item.rating))}</span>
                    <span className="text-gh-faint text-[10px]">({item.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bebas text-xl text-gh-red">
                    ₦{item.priceNGN.toLocaleString()}
                  </span>
                  <TokenBadge amount={item.tokenCost} />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  disabled={!item.inStock}
                >
                  {item.inStock ? 'Add to Cart' : 'Notify Me'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link to='/store'>
          <Button variant="outline">Browse Full Store</Button>
        </Link>
      </div>
    </section>
  )
}
