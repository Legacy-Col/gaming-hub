import { useApi } from './useApi'
import { api } from '@/lib/api'
import { FALLBACK_ARTICLES } from './useArticles'
import type { Article, ApiResponse } from '@/types'

export function useArticle(slug: string, enabled: boolean = true) {
  const fallback = FALLBACK_ARTICLES.find(a => a.slug === slug) ?? FALLBACK_ARTICLES[0]

  return useApi<Article>(
    () =>
      enabled
        ? api.articles.get(slug)
        : Promise.resolve({ data: fallback, success: true } as ApiResponse<Article>),
    fallback,
    [slug, enabled],
  )
}