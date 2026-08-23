import type {
  ApiResponse,
  Team,
  TeamQueryParams,
  Tournament,
  TournamentQueryParams,
  StoreItem,
  StoreQueryParams,
  PlatformStats,
  User,
  ProfileUpdatePayload,
  TokenTransaction,
  TournamentDetail,
  TournamentRegistration,
  CheckoutPayload,
  TeamDetail,
  CreateTeamPayload,
  Article,
  ArticleQueryParams,
  CreateArticlePayload,
  UpdateArticlePayload,
  CreateTournamentPayload,
  UpdateTournamentPayload,
  CreateStoreItemPayload,
  UpdateStoreItemPayload,
  AdminCreateTeamPayload,
  AdminUpdateTeamPayload
} from '@/types'


// ─── Base Configuration ───────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

// ─── HTTP Client ──────────────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
  return qs ? `?${qs}` : ''
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // Auth token — attach if present in localStorage
      ...(localStorage.getItem('gh_token')
        ? { Authorization: `Bearer ${localStorage.getItem('gh_token')}` }
        : {}),
    },
    ...options,
  })

  if (!res.ok) {
    throw new ApiError(res.status, `API error ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<ApiResponse<T>>
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const api = {
  // Platform stats (hero section)
  stats: {
    get: () => request<PlatformStats>('/api/stats'),
  },

  // Tournaments
  // Update the tournaments section
tournaments: {
    list: (params: TournamentQueryParams = {}) =>
        request<Tournament[]>(`/api/tournaments${buildQuery(params)}`),

    get: (id: string) =>
        request<TournamentDetail>(`/api/tournaments/${id}`),

    register: (payload: TournamentRegistration) =>
        request<{ success: boolean; message: string }>(
            `/api/tournaments/${payload.tournamentId}/register`,
            {
                method: 'POST',
                body: JSON.stringify(payload),
            }
        ),

        unregister: (tournamentId: string) =>
        request<{ success: boolean }>(
            `/api/tournaments/${tournamentId}/unregister`,
            { method: 'DELETE' }
        ),

    // ── Admin only — backend must verify requester's role ──
    create: (payload: CreateTournamentPayload) =>
        request<TournamentDetail>('/api/admin/tournaments', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    update: (id: string, payload: UpdateTournamentPayload) =>
        request<TournamentDetail>(`/api/admin/tournaments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/api/admin/tournaments/${id}`, {
            method: 'DELETE',
        }),
},

  // Auth
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: User }>(
        '/api/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) },
      ),
    register: (payload: {
      username: string
      email: string
      password: string
    }) =>
      request<{ token: string; user: User }>(
        '/api/auth/register',
        { method: 'POST', body: JSON.stringify(payload) },
      ),
    
     forgotPassword: (email: string) =>
        request<{ message: string }>('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    logout: () => {
      localStorage.removeItem('gh_token')
    },
  },

  // Add inside the api object
profile: {
    get: () =>
        request<User>('/api/profile'),
    update: (payload: ProfileUpdatePayload) =>
        request<User>('/api/profile/update', {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
    uploadAvatar: (file: File) => {
        const formData = new FormData()
        formData.append('avatar', file)
        return request<{ avatarUrl: string }>('/api/profile/avatar', {
            method: 'POST',
            body: formData,
        })
    },
    tokenHistory: () =>
        request<TokenTransaction[]>('/api/profile/tokens/history'),
  },

  // Update store section
store: {
    list: (params: StoreQueryParams = {}) =>
        request<StoreItem[]>(`/api/store/items${buildQuery(params)}`),

    get: (id: string) =>
        request<StoreItem>(`/api/store/items/${id}`),

       checkout: (payload: CheckoutPayload) =>
        request<{ orderId: string; message: string }>('/api/store/checkout', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    // ── Admin only ──
    create: (payload: CreateStoreItemPayload) =>
        request<StoreItem>('/api/admin/store/items', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    update: (id: string, payload: UpdateStoreItemPayload) =>
        request<StoreItem>(`/api/admin/store/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/api/admin/store/items/${id}`, {
            method: 'DELETE',
        }),
  },

  teams: {
    list: (params: TeamQueryParams = {}) =>
        request<Team[]>(`/api/teams/rankings${buildQuery(params)}`),

    get: (id: string) =>
        request<TeamDetail>(`/api/teams/${id}`),

    create: (payload: CreateTeamPayload) =>
        request<TeamDetail>('/api/teams', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    join: (teamId: string) =>
        request<{ success: boolean }>(`/api/teams/${teamId}/join`, {
            method: 'POST',
        }),

    leave: (teamId: string) =>
        request<{ success: boolean }>(`/api/teams/${teamId}/leave`, {
            method: 'DELETE',
        }),

    getMyTeam: () =>
        request<TeamDetail>('/api/teams/my-team'),

        uploadLogo: (file: File) => {
        const formData = new FormData()
        formData.append('logo', file)
        return request<{ logoUrl: string }>('/api/teams/logo', {
            method: 'POST',
            body: formData,
        })
    },

    // ── Admin only — create/edit/remove ANY team, not just your own ──
    adminCreate: (payload: AdminCreateTeamPayload) =>
        request<TeamDetail>('/api/admin/teams', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    adminUpdate: (id: string, payload: AdminUpdateTeamPayload) =>
        request<TeamDetail>(`/api/admin/teams/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    adminDelete: (id: string) =>
        request<{ success: boolean }>(`/api/admin/teams/${id}`, {
            method: 'DELETE',
        }),
},

  // Articles (admin-authored blog/news content)
  articles: {
    // Public — published articles only (backend should filter by status='published'
    // unless the requester is an authenticated admin)
    list: (params: ArticleQueryParams = {}) =>
        request<Article[]>(`/api/articles${buildQuery(params as Record<string, string | number | undefined>)}`),

    get: (slug: string) =>
        request<Article>(`/api/articles/${slug}`),

    // Admin only — backend must verify requester's role, not just the presence of a token
    create: (payload: CreateArticlePayload) =>
        request<Article>('/api/articles', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    update: (id: string, payload: UpdateArticlePayload) =>
        request<Article>(`/api/articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/api/articles/${id}`, {
            method: 'DELETE',
        }),

    uploadImage: (file: File) => {
        const formData = new FormData()
        formData.append('image', file)
        return request<{ url: string }>('/api/articles/upload-image', {
            method: 'POST',
            body: formData,
        })
    },
  },
}

export { ApiError }
