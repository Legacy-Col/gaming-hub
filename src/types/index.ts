// ─── Core Domain Types ────────────────────────────────────────────────────────

export type GameTitle =
  | 'Valorant'
  | 'FIFA 25'
  | 'Call of Duty: MW3'
  | 'eFootball'
  | 'Mortal Kombat 1'
  | 'Street Fighter 6'
  | string

export type TrendDirection = 'up' | 'down' | 'stable'
export type TournamentStatus = 'upcoming' | 'live' | 'completed'
export type TournamentFormat = 'bracket' | 'round-robin' | 'league'
export type StoreCategory = 'gaming-gear' | 'anime-merch'

export interface Team {
  id: string
  rank: number
  name: string
  tag: string
  game: GameTitle
  wins: number
  losses: number
  points: number
  tokens: number
  trend: TrendDirection
  logoUrl?: string
  region?: string
}

export interface Tournament {
  id: string
  title: string
  game: GameTitle
  status: TournamentStatus
  prizePool: string
  entryFee: string | null
  tokenCost?: number
  startDate: string
  endDate?: string
  maxTeams: number
  registeredTeams: number
  format: TournamentFormat
  imageUrl?: string
}

export interface StoreItem {
  id: string
  name: string
  category: StoreCategory
  priceNGN: number
  tokenCost: number
  imageUrl?: string
  emoji: string
  inStock: boolean
  rating: number
  reviewCount: number
}

export interface PlatformStats {
  activePlayers: number
  tournamentsRun: number
  gameTitles: number
  totalPrizesNGN: number
}

export interface User {
  id: string
  username: string
  email: string
  avatarUrl?: string
  teamId?: string
  tokens: number
  joinedAt: string
  role?: 'user' | 'admin'
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface TeamQueryParams extends PaginationParams {
  game?: GameTitle
  sortBy?: 'points' | 'wins' | 'tokens'
   [key: string]: string | number | undefined
}

export interface TournamentQueryParams extends PaginationParams {
  status?: TournamentStatus
  game?: GameTitle
   [key: string]: string | number | undefined
}

export interface StoreQueryParams extends PaginationParams {
  category?: StoreCategory
  sortBy?: 'price' | 'rating' | 'newest'
   [key: string]: string | number | undefined
}

// ── Token Transaction ─────────────────────────────────
export type TokenTransactionType = 'earned' | 'spent'

export interface TokenTransaction {
    id: string
    type: TokenTransactionType
    amount: number
    reason: string        // e.g. "1st place — Lagos Open Season 3"
    date: string          // ISO 8601
}

// ── Profile Update ────────────────────────────────────────
export interface ProfileUpdatePayload {
    username: string
    bio: string
    avatarUrl?: string
}

// ── Match ──────────────────────────────
export interface MatchTeam {
    id: string
    name: string
    tag: string
    score: number | null
}

export interface Match {
    id: string
    round: number
    matchNumber: number
    teamA: MatchTeam | null
    teamB: MatchTeam | null
    winner: string | null    // team id of winner
    scheduledAt: string | null
}

// ── Round Robin ───────────────────────────
export interface RoundRobinStanding {
    teamId:   string
    teamName: string
    teamTag:  string
    played:   number
    won:      number
    lost:     number
    points:   number
}

// ── Tournament Detail ────────────────────
export interface TournamentDetail extends Tournament {
    description:  string
    rules:        string[]
    matches:      Match[]
    standings:    RoundRobinStanding[]
    participants: {
        id: string
        name: string
        tag: string
    }[]
}

// ── Registration ─────────────────
export type RegistrationType = 'team' | 'individual'

export interface TournamentRegistration {
    tournamentId:     string
    type:             RegistrationType
    teamId?:          string
    playerName?:      string
    gameTag?:         string
}

// ── Cart ───────────────────────────
export interface CartItem {
    product:  StoreItem
    quantity: number
}

export type PaymentMethod = 'naira' | 'tokens'

export interface CheckoutPayload {
    items:         CartItem[]
    paymentMethod: PaymentMethod
    totalNGN:      number
    totalTokens:   number
}

// ── Team Member ───────────────────────────────────────────────────────────────
export type TeamRole = 'captain' | 'member'

export interface TeamMember {
    id:       string
    username: string
    role:     TeamRole
    joinedAt: string
  avatarUrl?: string
  bio?: string
}

// ── Team Detail ───────────────────────────────────────────────────────────────
export interface TeamDetail {
    id:          string
    name:        string
    tag:         string
    game:        GameTitle
    description: string
    logoUrl?:    string
    rank:        number
    wins:        number
    losses:      number
    points:      number
    tokens:      number
    trend:       TrendDirection
    members:     TeamMember[]
    captainId:   string
    createdAt:   string
}

// ── Team Create ───────────────────────────────────────────────────────────────
export interface CreateTeamPayload {
    name:        string
    tag:         string
    game:        GameTitle
    description: string
    logoUrl?:    string
}

// ── Articles ─────────────────────────────────────────────────────────────────
export type ArticleStatus = 'draft' | 'published'

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImageUrl?: string
  contentHtml: string
  authorName: string
  authorAvatarUrl?: string
  status: ArticleStatus
  tags: string[]
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ArticleQueryParams {
  tag?: string
  page?: number
  perPage?: number
}

export interface CreateArticlePayload {
  title: string
  excerpt: string
  contentHtml: string
  coverImageUrl?: string
  tags: string[]
  status: ArticleStatus
}

export type UpdateArticlePayload = Partial<CreateArticlePayload>

// ── Admin: Tournament management ────────────────────────────────────────────────
export interface CreateTournamentPayload {
  title: string
  game: GameTitle
  prizePool: string
  entryFee: string | null
  tokenCost?: number
  startDate: string
  endDate?: string
  maxTeams: number
  format: TournamentFormat
  imageUrl?: string
  description: string
  rules: string[]        // tournament regulations, one entry per rule
}

export type UpdateTournamentPayload = Partial<CreateTournamentPayload> & {
  status?: TournamentStatus
}

// ── Admin: Store management ─────────────────────────────────────────────────────
export interface CreateStoreItemPayload {
  name: string
  category: StoreCategory
  priceNGN: number
  tokenCost: number
  imageUrl?: string
  emoji: string
  inStock: boolean
}

export type UpdateStoreItemPayload = Partial<CreateStoreItemPayload>

// ── Admin: Team management ──────────────────────────────────────────────────────
// Distinct from the player-facing CreateTeamPayload — an admin can create or edit
// ANY team on the platform and must assign who the captain is.
export interface AdminCreateTeamPayload {
  name: string
  tag: string
  game: GameTitle
  description: string
  logoUrl?: string
  captainUsername: string
}

export type AdminUpdateTeamPayload = Partial<AdminCreateTeamPayload>