import { createContext, useContext, useState, type ReactNode } from 'react'
import type { CartItem, StoreItem } from '@/types'

interface CartContextType {
    items: CartItem[]
    totalItems: number
    totalNGN: number
    totalTokens: number
    addItem: (product: StoreItem) => void
    removeItem: (productId: string) => void
    updateQty: (productId: string, quantity: number) => void
    clearCart: () => void
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    const addItem = (product: StoreItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id)
            if (existing) {
                return prev.map(i =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            }
            return [...prev, { product, quantity: 1 }]
        })
        setIsOpen(true)
    }

    const removeItem = (productId: string) => {
        setItems(prev => prev.filter(i => i.product.id !== productId))
    }

    const updateQty = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(productId)
            return
        }
        setItems(prev =>
            prev.map(i =>
                i.product.id === productId ? { ...i, quantity } : i
            )
        )
    }

    const clearCart = () => setItems([])

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalNGN = items.reduce((sum, i) => sum + i.product.priceNGN * i.quantity, 0)
    const totalTokens = items.reduce((sum, i) => sum + i.product.tokenCost * i.quantity, 0)

    return (
        <CartContext.Provider value={{
            items, totalItems, totalNGN, totalTokens,
            addItem, removeItem, updateQty, clearCart,
            isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used inside CartProvider')
    return context
}