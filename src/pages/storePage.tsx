import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/store/productCard'
import { CartSidebar } from '@/components/store/cartSidebar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useStore } from '@/hooks/useStore'
import { useCart } from '@/context/CartContext'
import type { StoreCategory } from '@/types'

const CATEGORIES: { label: string; value: StoreCategory | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Gaming Gear', value: 'gaming-gear' },
    { label: 'Anime Merch', value: 'anime-merch' },
]

const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low', value: 'price' },
    { label: 'Top Rated', value: 'rating' },
]

export function StorePage() {
    const [category, setCategory] = useState<StoreCategory | 'all'>('all')
    const [sortBy, setSortBy] = useState('newest')
    const { totalItems, openCart } = useCart()

    const { data: items, loading, error, refetch } = useStore(
        category === 'all' ? {} : { category }
    )

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
                <div className="max-w-7xl mx-auto">

                    {/* Page header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                        <div className="border-l-[3px] border-gh-purple pl-5">
                            <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-2">
                                // THE FORGE STORE
                            </div>
                            <h1 className="font-bebas text-gh-text leading-none"
                                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
                                GEAR UP.<br />
                                <span className="text-gh-muted" style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
                                    GAMING & ANIME MERCH
                                </span>
                            </h1>
                        </div>

                        {/* Cart button */}
                        <button
                            onClick={openCart}
                            className="btn-outline font-bebas tracking-widest text-base px-6 py-2.5 flex items-center gap-2 self-start sm:self-auto"
                        >
                            🛒 CART
                            {totalItems > 0 && (
                                <span className="bg-gh-purple text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filters row */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {/* Category */}
                        <div className="flex gap-2 flex-wrap">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setCategory(c.value)}
                                    className={[
                                        'font-bebas tracking-widest text-sm px-4 py-1.5 border clip-sm transition-colors',
                                        category === c.value
                                            ? 'border-gh-purple text-gh-purple bg-[rgba(123,47,190,0.12)]'
                                            : 'border-gh-border text-gh-muted hover:border-gh-purple hover:text-gh-purple',
                                    ].join(' ')}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="flex gap-2 flex-wrap sm:ml-auto">
                            {SORT_OPTIONS.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => setSortBy(s.value)}
                                    className={[
                                        'font-bebas tracking-widest text-sm px-4 py-1.5 border clip-sm transition-colors',
                                        sortBy === s.value
                                            ? 'border-gh-gold text-gh-gold bg-[rgba(255,184,0,0.08)]'
                                            : 'border-gh-border text-gh-muted hover:border-gh-gold hover:text-gh-gold',
                                    ].join(' ')}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results count */}
                    {!loading && !error && (
                        <div className="font-mono text-[11px] text-gh-faint tracking-widest mb-6">
                            {items?.length ?? 0} PRODUCTS FOUND
                        </div>
                    )}

                    {/* Grid */}
                    {loading && <LoadingSpinner />}
                    {error && <ErrorState message={error} onRetry={refetch} />}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5">
                            {items?.map(item => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && items?.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-4xl mb-4">🎮</div>
                            <p className="font-bebas text-2xl text-gh-muted tracking-widest">
                                NO PRODUCTS FOUND
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <CartSidebar />
        </>
    )
}