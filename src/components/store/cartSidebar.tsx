import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { CheckoutModal } from './checkoutModal'

export function CartSidebar() {
    const { items, totalItems, totalNGN, totalTokens, removeItem, updateQty, closeCart, isOpen, clearCart } = useCart()
    const [showCheckout, setShowCheckout] = useState(false)

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40"
                    onClick={closeCart}
                />
            )}

            {/* Sidebar */}
            <div className={[
                'fixed top-0 right-0 h-full w-full sm:w-96 bg-gh-card border-l border-gh-border z-50',
                'flex flex-col transition-transform duration-300',
                isOpen ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gh-border">
                    <div>
                        <h2 className="font-bebas text-2xl tracking-widest text-gh-text">
                            YOUR CART
                        </h2>
                        <p className="font-mono text-[10px] text-gh-faint tracking-wider">
                            {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
                        </p>
                    </div>
                    <button
                        onClick={closeCart}
                        className="font-mono text-gh-faint hover:text-gh-text transition-colors text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                            <div className="text-5xl opacity-20">🛒</div>
                            <p className="font-rajdhani text-gh-muted text-sm tracking-wider">
                                Your cart is empty
                            </p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div
                                key={item.product.id}
                                className="flex gap-4 bg-gh-card2 border border-gh-border p-3 clip-sm"
                            >
                                {/* Product image/emoji */}
                                <div className="w-16 h-16 bg-gh-bg flex items-center justify-center text-3xl flex-shrink-0 border border-gh-border">
                                    {item.product.imageUrl
                                        ? <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                        : item.product.emoji
                                    }
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-rajdhani font-bold text-sm text-gh-text leading-snug truncate">
                                        {item.product.name}
                                    </p>
                                    <p className="font-bebas text-lg text-gh-red tracking-wide mt-0.5">
                                        ₦{(item.product.priceNGN * item.quantity).toLocaleString()}
                                    </p>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                                            className="w-6 h-6 border border-gh-border text-gh-text font-bold text-sm flex items-center justify-center hover:border-gh-purple transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="font-mono text-sm text-gh-text w-4 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                                            className="w-6 h-6 border border-gh-border text-gh-text font-bold text-sm flex items-center justify-center hover:border-gh-purple transition-colors"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="ml-auto font-mono text-[10px] text-gh-faint hover:text-gh-red transition-colors"
                                        >
                                            REMOVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gh-border px-5 py-5 flex flex-col gap-4">
                        {/* Totals */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-[11px] tracking-[2px] uppercase text-gh-faint">
                                    Total (Naira)
                                </span>
                                <span className="font-bebas text-2xl text-gh-red tracking-wide">
                                    ₦{totalNGN.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-[11px] tracking-[2px] uppercase text-gh-faint">
                                    Total (Tokens)
                                </span>
                                <span className="font-bebas text-xl text-gh-gold tracking-wide">
                                    ◈ {totalTokens.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Checkout button */}
                        <button
                            onClick={() => {
                                closeCart()
                                setShowCheckout(true)
                            }}
                            className="btn-primary w-full font-bebas tracking-widest text-lg py-3"
                        >
                            PROCEED TO CHECKOUT
                        </button>

                        {/* Clear cart */}
                        <button
                            onClick={clearCart}
                            className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint hover:text-gh-red transition-colors text-center"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>

            {/* Checkout modal */}
            {showCheckout && (
                <CheckoutModal
                    onClose={() => setShowCheckout(false)}
                    onSuccess={() => {
                        setShowCheckout(false)
                        clearCart()
                    }}
                />
            )}
        </>
    )
}