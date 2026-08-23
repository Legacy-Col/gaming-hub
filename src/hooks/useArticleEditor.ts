import { useState } from 'react'
import { api } from '@/lib/api'
import type { Article, CreateArticlePayload, UpdateArticlePayload } from '@/types'

const isMock = () =>
  !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')

export function useArticleEditor() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const createArticle = async (payload: CreateArticlePayload): Promise<Article | null> => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      // ── MOCK — remove when backend is ready ──
      if (isMock()) {
        await new Promise(resolve => setTimeout(resolve, 1200))
        const now = new Date().toISOString()
        const mockArticle: Article = {
          id: `mock-${Date.now()}`,
          slug: payload.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          ...payload,
          authorName: 'You (Admin)',
          publishedAt: payload.status === 'published' ? now : null,
          createdAt: now,
          updatedAt: now,
        }
        setSuccess('Article saved (mock mode — connect the backend to persist it for real).')
        return mockArticle
      }
      // ── END MOCK ──

      const res = await api.articles.create(payload)
      setSuccess('Article saved.')
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const updateArticle = async (id: string, payload: UpdateArticlePayload): Promise<Article | null> => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      // ── MOCK — remove when backend is ready ──
      if (isMock()) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccess('Article updated (mock mode).')
        return null
      }
      // ── END MOCK ──

      const res = await api.articles.update(id, payload)
      setSuccess('Article updated.')
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const deleteArticle = async (id: string): Promise<boolean> => {
    try {
      setIsSaving(true)
      setError(null)

      // ── MOCK — remove when backend is ready ──
      if (isMock()) {
        await new Promise(resolve => setTimeout(resolve, 800))
        return true
      }
      // ── END MOCK ──

      await api.articles.delete(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // ── MOCK — remove when backend is ready ──
      if (isMock()) {
        await new Promise(resolve => setTimeout(resolve, 600))
        return URL.createObjectURL(file) // local preview only — not persisted
      }
      // ── END MOCK ──

      const res = await api.articles.uploadImage(file)
      return res.data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed')
      return null
    }
  }

  return { isSaving, error, success, createArticle, updateArticle, deleteArticle, uploadImage }
}