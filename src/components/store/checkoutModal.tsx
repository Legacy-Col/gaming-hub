import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuthContext } from '@/context/AuthContext'
import { api } from '@/lib/api'
import type { PaymentMethod } from '@/types'

interface CheckoutModalProps {
    onClose: () => void
    onSuccess: () => void
}

export function CheckoutModal({ onClose, onSuccess }: CheckoutModalProps) {
    const { items, totalNGN, totalTokens, totalItems } = useCart()
    const { user } = useAuthContext()
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('naira')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [step, setStep] = useState<'review' | 'success'>('review')

    const canPayWithTokens = (user?.tokens ?? 0) >= totalTokens

    const handleCheckout = async () => {
        try {
            setIsLoading(true)
            setError(null)

            // ── MOCK — remove when backend is ready ──
            if (import.meta.env.DEV) {
                await new Promise(resolve => setTimeout(resolve, 2000))
                setStep('success')
                return
            }
            // ── END MOCK ──

            await api.store.checkout({
                items,
                paymentMethod,
                totalNGN,
                totalTokens,
            })
            setStep('success')

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Checkout failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div
                className="bg-gh-card border border-gh-border w-full max-w-md clip-lg p-6 sm:p-8"
                onClick={e => e.stopPropagation()}
            >
                {step === 'success' ? (
                    /* ── Success state ── */
                    <div className="text-center py-6 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center">
                            <span className="text-green-500 text-2xl">✓</span>
                        </div>
                        <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                            ORDER CONFIRMED
                        </h2>
                        <p className="font-rajdhani text-gh-muted text-sm text-center leading-relaxed">
                            Your order has been placed successfully. You'll receive a confirmation shortly.
                        </p>
                        <button
                            onClick={onSuccess}
                            className="btn-primary font-bebas tracking-widest text-lg px-10 py-3 mt-2"
                        >
                            DONE
                        </button>
                    </div>

                ) : (
                    /* ── Review state ── */
                    <>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="font-mono text-[10px] tracking-[3px] text-gh-purple mb-1">
                                    // CHECKOUT
                                </div>
                                <h2 className="font-bebas text-2xl tracking-widest text-gh-text">
                                    REVIEW ORDER
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="font-mono text-gh-faint hover:text-gh-text transition-colors text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Order summary */}
                        <div className="bg-gh-card2 border border-gh-border p-4 mb-5 flex flex-col gap-2">
                            <div className="flex justify-between font-mono text-[10px] tracking-[2px] uppercase text-gh-faint">
                                <span>{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</span>
                                <span>Summary</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-rajdhani text-sm text-gh-muted">Total (Naira)</span>
                                <span className="font-bebas text-xl text-gh-red tracking-wide">
                                    ₦{totalNGN.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-rajdhani text-sm text-gh-muted">Total (Tokens)</span>
                                <span className="font-bebas text-xl text-gh-gold tracking-wide">
                                    ◈ {totalTokens.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Payment method */}
                        <div className="mb-5">
                            <div className="font-mono text-[10px] tracking-[3px] uppercase text-gh-faint mb-3">
                                Payment Method
                            </div>
                            <div className="flex flex-col gap-2">
                                {/* Naira */}
                                <button
                                    onClick={() => setPaymentMethod('naira')}
                                    className={[
                                        'flex items-center justify-between px-4 py-3 border clip-sm transition-colors',
                                        paymentMethod === 'naira'
                                            ? 'border-gh-purple bg-gh-purple/10'
                                            : 'border-gh-border hover:border-gh-purple',
                                    ].join(' ')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'naira' ? 'border-gh-purple' : 'border-gh-faint'}`}>
                                            {paymentMethod === 'naira' && (
                                                <div className="w-2 h-2 rounded-full bg-gh-purple" />
                                            )}
                                        </div>
                                        <span className="font-rajdhani font-semibold text-sm text-gh-text">
                                            Pay with Naira
                                        </span>
                                    </div>
                                    <span className="font-bebas text-lg text-gh-red tracking-wide">
                                        ₦{totalNGN.toLocaleString()}
                                    </span>
                                </button>

                                {/* Tokens */}
                                <button
                                    onClick={() => canPayWithTokens && setPaymentMethod('tokens')}
                                    disabled={!canPayWithTokens}
                                    className={[
                                        'flex items-center justify-between px-4 py-3 border clip-sm transition-colors',
                                        !canPayWithTokens ? 'opacity-40 cursor-not-allowed border-gh-border' :
                                            paymentMethod === 'tokens'
                                                ? 'border-gh-gold bg-gh-gold/5'
                                                : 'border-gh-border hover:border-gh-gold',
                                    ].join(' ')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'tokens' ? 'border-gh-gold' : 'border-gh-faint'}`}>
                                            {paymentMethod === 'tokens' && (
                                                <div className="w-2 h-2 rounded-full bg-gh-gold" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <span className="font-rajdhani font-semibold text-sm text-gh-text block">
                                                Pay with FORGE Tokens
                                            </span>
                                            {!canPayWithTokens && (
                                                <span className="font-mono text-[10px] text-gh-red">
                                                    Insufficient tokens (you have ◈ {user?.tokens ?? 0})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bebas text-lg text-gh-gold tracking-wide">
                                        ◈ {totalTokens.toLocaleString()}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-[rgba(255,34,0,0.08)] border border-gh-red px-4 py-3 mb-4">
                                <p className="font-rajdhani text-sm text-gh-red">{error}</p>
                            </div>
                        )}

                        {/* Confirm button */}
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="btn-primary w-full font-bebas tracking-widest text-lg py-3"
                        >
                            {isLoading ? 'PROCESSING...' : `CONFIRM & PAY ${paymentMethod === 'naira' ? `₦${totalNGN.toLocaleString()}` : `◈ ${totalTokens}`}`}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}