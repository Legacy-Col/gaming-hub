import { useApi } from './useApi'
import { api } from '@/lib/api'
import type { StoreItem, StoreQueryParams } from '@/types'


import Headset from '@/assets/store/headsets.jpg'
import Chair from '@/assets/store/Ergon_chair.jpg'
import Hoodies from '@/assets/store/Naruto_hoodie.jpg'
import Gloves from '@/assets/store/Lumi_gloves.jpg'


const FALLBACK: StoreItem[] = [
  {
    id: '1',
    name: 'Pro Wireless Headset',
    category: 'gaming-gear',
    priceNGN: 45000,
    tokenCost: 200,
    emoji: '🎧',
    inStock: true,
    rating: 4.7,
    reviewCount: 84,
    imageUrl: Headset
  },
  {
    id: '2',
    name: 'Ergonomic Gaming Chair',
    category: 'gaming-gear',
    priceNGN: 38000,
    tokenCost: 160,
    emoji: '💺',
    inStock: true,
    rating: 4.5,
    reviewCount: 62,
    imageUrl: Chair
  },
  {
    id: '3',
    name: 'Naruto Shippuden Hoodie',
    category: 'anime-merch',
    priceNGN: 22000,
    tokenCost: 90,
    emoji: '👘',
    inStock: true,
    imageUrl: Hoodies,
    rating: 4.8,
    reviewCount: 103
  },
  {
    id: '4',
    name: 'Gaming Gloves ',
    category: 'gaming-gear',
    priceNGN: 28000,
    tokenCost: 120,
    emoji: '🧤',
    inStock: false,
    rating: 4.6,
    reviewCount: 77,
    imageUrl: Gloves
  },
]

export function useStore(params: StoreQueryParams = {}) {
  return useApi<StoreItem[]>(() => api.store.list(params), FALLBACK, [JSON.stringify(params)])
}
