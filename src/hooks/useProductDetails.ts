import { useApi } from './useApi'
import { api } from '@/lib/api'
import type { StoreItem } from '@/types'

const FALLBACK: StoreItem = {
    id: '1',
    name: 'Pro Wireless Headset',
    category: 'gaming-gear',
    priceNGN: 45000,
    tokenCost: 200,
    emoji: '🎧',
    inStock: true,
    rating: 4.7,
    reviewCount: 84,
}

export function useProductDetail(id: string, enabled: boolean = true) {
    return useApi<StoreItem>(
        () => (enabled ? api.store.get(id) : Promise.resolve({ data: FALLBACK, success: true })),
        FALLBACK,
        [id, enabled],
    )
}