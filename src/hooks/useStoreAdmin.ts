import { useState } from 'react'
import { api } from '@/lib/api'
import type { StoreItem, CreateStoreItemPayload, UpdateStoreItemPayload } from '@/types'

const isMock = () =>
  !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')

export function useStoreAdmin() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const createItem = async (payload: CreateStoreItemPayload): Promise<StoreItem | null> => {
    try {
      setIsSaving(true); setError(null); setSuccess(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 900))
        const mock: StoreItem = { id: `mock-${Date.now()}`, ...payload, rating: 0, reviewCount: 0 }
        setSuccess('Item added to the store (mock mode — connect the backend to persist it for real).')
        return mock
      }

      const res = await api.store.create(payload)
      setSuccess('Item added to the store.')
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const updateItem = async (id: string, payload: UpdateStoreItemPayload): Promise<StoreItem | null> => {
    try {
      setIsSaving(true); setError(null); setSuccess(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 700))
        setSuccess('Item updated (mock mode).')
        return null
      }

      const res = await api.store.update(id, payload)
      setSuccess('Item updated.')
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      setIsSaving(true); setError(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 600))
        return true
      }

      await api.store.delete(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { isSaving, error, success, createItem, updateItem, deleteItem }
}