import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { StarRating } from './starRating'
import type { StoreItem } from '@/types'

interface ProductCardProps {
    item: StoreItem
}

export function ProductCard({ item }: ProductCardProps) {
    const { addItem } = useCart()

    return (
        <div className="store-card flex flex-col group">
            {/* Image */}
            <Link to={`/store/${item.id}`} className="block">
                <div className="h-48 bg-gh-card2 flex items-center justify-center text-6xl border-b border-gh-border relative overflow-hidden">
                    {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        : item.emoji
                    }
                    {!item.inStock && (
                        <div className="absolute inset-0 bg-gh-bg/80 flex items-center justify-center">
                            <span className="font-bebas text-lg tracking-widest text-gh-faint">
                                OUT OF STOCK
                            </span>
                        </div>
                    )}
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <span className="font-mono text-[9px] tracking-[2px] uppercase bg-gh-bg/80 border border-gh-border text-gh-faint px-2 py-0.5 rounded-sm">
                            {item.category === 'gaming-gear' ? 'Gaming Gear' : 'Anime Merch'}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Body */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                <div>
                    <Link to={`/store/${item.id}`}>
                        <h3 className="font-rajdhani font-bold text-base text-gh-text leading-snug hover:text-gh-purple transition-colors">
                            {item.name}
                        </h3>
                    </Link>
                    <div className="mt-1.5">
                        <StarRating rating={item.rating} reviewCount={item.reviewCount} />
                    </div>
                </div>

                {/* Price row */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bebas text-2xl text-gh-red tracking-wide">
                        ₦{item.priceNGN.toLocaleString()}
                    </span>
                    <span className="token-badge text-[11px]">◈ {item.tokenCost}</span>
                </div>

                {/* Add to cart */}
                <button
                    onClick={() => addItem(item)}
                    disabled={!item.inStock}
                    className="btn-primary w-full font-bebas tracking-widest text-base py-2.5"
                >
                    {item.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
            </div>
        </div>
    )
}