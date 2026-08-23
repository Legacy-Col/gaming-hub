import { useApi } from './useApi'
import { api } from '@/lib/api'
import type { Article, ArticleQueryParams } from '@/types'

export const FALLBACK_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'carry1st-africa-cup-spinoff-recap',
    title: 'Recapping the Carry1st X GamingHub Spin-Off Challenge',
    excerpt: 'Players from seven countries brought serious firepower to our biggest cross-border event yet.',
    coverImageUrl: '',
    contentHtml: '<p>Players from Egypt, Ghana, Kenya, Rwanda, Uganda, Burkina Faso and Ivory Coast joined the spin-off challenge alongside our home crowd in Nigeria...</p>',
    authorName: 'GamingHub Africa',
    status: 'published',
    tags: ['Tournaments', 'Partnerships'],
    publishedAt: '2025-11-02T10:00:00Z',
    createdAt: '2025-11-01T09:00:00Z',
    updatedAt: '2025-11-02T10:00:00Z',
  },
  {
    id: '2',
    slug: 'why-esports-is-a-real-career-path',
    title: 'Why Esports Is a Real Career Path in West Africa',
    excerpt: 'Discipline, dedication, and a supportive community — what it actually takes to go pro.',
    coverImageUrl: '',
    contentHtml: '<p>Esports is still young in West Africa, but the path to going pro is more real than most people think...</p>',
    authorName: 'GamingHub Africa',
    status: 'published',
    tags: ['Community', 'Careers'],
    publishedAt: '2025-09-18T10:00:00Z',
    createdAt: '2025-09-17T09:00:00Z',
    updatedAt: '2025-09-18T10:00:00Z',
  },
]

export function useArticles(params: ArticleQueryParams = {}) {
  return useApi<Article[]>(
    () => api.articles.list(params),
    FALLBACK_ARTICLES,
    [JSON.stringify(params)],
  )
}