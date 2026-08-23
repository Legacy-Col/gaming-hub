import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'

import { LoginPage } from '@/pages/loginPage'
import { RegisterPage } from '@/pages/registerPage'
import { ForgotPasswordPage } from '@/pages/forgotpasswordPage'
import { DashboardPage } from '@/pages/dashboardPage'
import { LandingPage } from '@/pages/landingPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { TournamentsPage } from './pages/TournamentPage'
import { TournamentDetailPage } from './pages/TournamentDetails'
import { StorePage } from '@/pages/storePage'
import { ProductDetailPage } from '@/pages/productDetailPage'
import { TeamPage } from './pages/TeamPage'
import { RankingsPage } from './pages/RankingPage'
import { ArticleDetailPage } from './pages/ArticleDetailPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminTournamentsPage } from './pages/admin/AdminTournamentsPage'
import { AdminTournamentEditorPage } from './pages/admin/AdminTournamentEditorPage'
import { AdminStorePage } from './pages/admin/AdminStorePage'
import { AdminStoreEditorPage } from './pages/admin/AdminStoreEditorPage'
import { AdminTeamsPage } from './pages/admin/AdminTeamsPage'
import { ArticleEditorPage } from './pages/admin/ArticleEditorPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { NotFoundPage } from './pages/NotFoundPage'

// ── Protected route ────────────────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gh-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gh-border border-t-gh-purple rounded-full animate-spin" />
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// ── Admin-only route ────────────────────────────────────────────────────────────
// NOTE: this only hides the UI from non-admins in the browser. The backend MUST
// independently verify the requester's role on every write endpoint — never trust
// this client-side check as the actual security boundary.
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gh-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gh-border border-t-gh-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/articles" replace />
  return <>{children}</>
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/tournaments/:id" element={<TournamentDetailPage />} />

      <Route path="/store" element={<StorePage />} />
      <Route path="/store/:id" element={<ProductDetailPage />} />

      <Route path="/team" element={
        <ProtectedRoute>
          <TeamPage />
        </ProtectedRoute>
      } />

            <Route path="/rankings" element={<RankingsPage />} />

      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticleDetailPage />} />

      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
      } />

      <Route path="/admin/tournaments" element={<AdminRoute><AdminTournamentsPage /></AdminRoute>} />
      <Route path="/admin/tournaments/new" element={<AdminRoute><AdminTournamentEditorPage /></AdminRoute>} />
      <Route path="/admin/tournaments/:id/edit" element={<AdminRoute><AdminTournamentEditorPage /></AdminRoute>} />

      <Route path="/admin/store" element={<AdminRoute><AdminStorePage /></AdminRoute>} />
      <Route path="/admin/store/new" element={<AdminRoute><AdminStoreEditorPage /></AdminRoute>} />
      <Route path="/admin/store/:id/edit" element={<AdminRoute><AdminStoreEditorPage /></AdminRoute>} />

      <Route path="/admin/teams" element={<AdminRoute><AdminTeamsPage /></AdminRoute>} />

      <Route path="/admin/articles/new" element={
        <AdminRoute>
          <ArticleEditorPage />
        </AdminRoute>
      } />
      <Route path="/admin/articles/:slug/edit" element={
        <AdminRoute>
          <ArticleEditorPage />
        </AdminRoute>
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}