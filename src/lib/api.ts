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
  CreateTeamPayload
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
},
}


export { ApiError }
