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
import { NotFoundPage } from '@/pages/NotFoundPage'



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


      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}