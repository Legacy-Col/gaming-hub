import { useParams, Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartSidebar } from '@/components/store/cartSidebar'
import { StarRating } from '@/components/store/starRating'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useProductDetail } from '@/hooks/useProductDetails'
import { useCart } from '@/context/CartContext'

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { data: item, loading, error, refetch } = useProductDetail(id ?? '1')
    const { addItem, openCart } = useCart()

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gh-bg flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </>
    )

    if (error || !item) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gh-bg flex items-center justify-center">
                <ErrorState message={error ?? 'Product not found'} onRetry={refetch} />
            </div>
        </>
    )

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
                <div className="max-w-5xl mx-auto">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 font-mono text-[11px] text-gh-faint tracking-wider mb-8">
                        <Link to="/" className="hover:text-gh-purple transition-colors">HOME</Link>
                        <span>/</span>
                        <Link to="/store" className="hover:text-gh-purple transition-colors">STORE</Link>
                        <span>/</span>
                        <span className="text-gh-purple truncate">{item.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        {/* Left — image */}
                        <div className="bg-gh-card border border-gh-border flex items-center justify-center h-72 sm:h-96 text-8xl clip-lg relative">
                            {item.imageUrl
                                ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                : item.emoji
                            }
                            {!item.inStock && (
                                <div className="absolute inset-0 bg-gh-bg/80 flex items-center justify-center">
                                    <span className="font-bebas text-2xl tracking-widest text-gh-faint">
                                        OUT OF STOCK
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right — details */}
                        <div className="flex flex-col gap-5">
                            {/* Category */}
                            <div className="font-mono text-[10px] tracking-[3px] uppercase text-gh-purple">
                                {item.category === 'gaming-gear' ? 'Gaming Gear' : 'Anime Merch'}
                            </div>

                            {/* Name */}
                            <h1 className="font-bebas text-gh-text leading-tight"
                                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                                {item.name}
                            </h1>

                            {/* Rating */}
                            <StarRating rating={item.rating} reviewCount={item.reviewCount} size="md" />

                            {/* Price */}
                            <div className="flex items-center gap-4 py-4 border-t border-b border-gh-border">
                                <div>
                                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-1">
                                        Price (Naira)
                                    </div>
                                    <div className="font-bebas text-3xl text-gh-red tracking-wide">
                                        ₦{item.priceNGN.toLocaleString()}
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-gh-border" />
                                <div>
                                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-1">
                                        Price (Tokens)
                                    </div>
                                    <div className="font-bebas text-3xl text-gh-gold tracking-wide">
                                        ◈ {item.tokenCost}
                                    </div>
                                </div>
                            </div>

                            {/* Stock status */}
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${item.inStock ? 'bg-green-500' : 'bg-gh-red'}`} />
                                <span className="font-mono text-[11px] tracking-wider text-gh-muted">
                                    {item.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                </span>
                            </div>

                            {/* Add to cart */}
                            <button
                                onClick={() => { addItem(item); openCart() }}
                                disabled={!item.inStock}
                                className="btn-primary w-full font-bebas tracking-widest text-xl py-4 mt-2"
                            >
                                {item.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                            </button>

                            {/* Back to store */}
                            <Link
                                to="/store"
                                className="font-mono text-[11px] tracking-[2px] uppercase text-gh-faint hover:text-gh-purple transition-colors text-center"
                            >
                                ← Back to Store
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <CartSidebar />
        </>
    )
}