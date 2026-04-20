import { useState, useEffect, useRef } from 'react'
import logoImg from '../assets/hub.jpeg'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { TokenBadge } from '@/components/ui/TokenBadge'


const NAV_LINKS = [
  { label: 'Tournaments', href: '/tournaments' },
  { label: 'Rankings', href: '/rankings' },
  { label: 'Store', href: '/store' },
  { label: 'Teams', href: '/team' },
]

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { user } = useAuthContext()
  const { handleLogout } = useAuth()
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-64 bg-gh-card border border-gh-border clip-lg z-50 overflow-hidden"
    >
      {/* User info */}
      <div className="px-4 py-4 border-b border-gh-border bg-gh-card2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gh-purple/20 border border-gh-purple flex items-center justify-center flex-shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="font-bebas text-lg text-gh-purple">
                {user?.username?.charAt(0).toUpperCase() ?? 'P'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-rajdhani font-bold text-sm text-gh-text truncate">
              {user?.username ?? 'Player'}
            </div>
            <div className="font-mono text-[10px] text-gh-faint truncate">
              {user?.email}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <TokenBadge amount={user?.tokens ?? 0} />
        </div>
      </div>

      {/* Links */}
      <div className="py-2">
        {[
          { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
          { label: 'Profile', href: '/profile', icon: '👤' },
          { label: 'My Team', href: '/team', icon: '⚔' },
          { label: 'Tournaments', href: '/tournaments', icon: '🏆' },
          { label: 'Store', href: '/store', icon: '🎮' },
        ].map(item => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 font-rajdhani font-semibold text-sm text-gh-muted hover:text-gh-text hover:bg-gh-card2 transition-colors tracking-wider"
          >
            <span className="text-base w-5">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-gh-border py-2">
        <button
          onClick={() => { handleLogout(); onClose() }}
          className="w-full flex items-center gap-3 px-4 py-2.5 font-rajdhani font-semibold text-sm text-gh-red hover:bg-[rgba(255,34,0,0.08)] transition-colors tracking-wider"
        >
          <span className="text-base w-5">⏻</span>
          Logout
        </button>
      </div>
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isAuthenticated, user } = useAuthContext()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const fn = () => setMenuOpen(false)
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [menuOpen])

  return (
    <nav className={[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-gh-bg/95 backdrop-blur-md border-b border-gh-border'
        : 'bg-transparent border-b border-transparent',
    ].join(' ')}>
      <div className=" px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center no-underline flex-shrink-0">
          <img
            src={logoImg}
            alt="Gaming Hub Africa"
            className="h-20 w-auto object-contain"
            style={{ mixBlendMode: 'screen' }}
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {NAV_LINKS.map(l => (
            <Link key={l.label} to={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-auto">
          {isAuthenticated ? (
            /* ── Logged in — profile button + dropdown ── */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-2.5 border border-gh-border hover:border-gh-purple px-3 py-1.5 clip-sm transition-colors duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-gh-purple/20 border border-gh-purple flex items-center justify-center flex-shrink-0">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-bebas text-sm text-gh-purple">
                      {user?.username?.charAt(0).toUpperCase() ?? 'P'}
                    </span>
                  )}
                </div>
                <span className="font-rajdhani font-semibold text-sm text-gh-text">
                  {user?.username ?? 'Player'}
                </span>
                <span className={`font-mono text-[10px] text-gh-faint transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              {dropdownOpen && (
                <ProfileDropdown onClose={() => setDropdownOpen(false)} />
              )}
            </div>
          ) : (
            /* ── Not logged in — login + register ── */
            <>
              <Link to="/login">
                <button className="btn-outline font-bebas tracking-widest text-sm px-5 py-2">
                  LOG IN
                </button>
              </Link>
              <Link to="/register">
                <button className="btn-primary font-bebas tracking-widest text-sm px-5 py-2">
                  JOIN NOW
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gh-text transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gh-text transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gh-text transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden bg-gh-bg/98 border-t border-gh-border px-4 py-6 flex flex-col gap-5"
          onClick={e => e.stopPropagation()}
        >
          {NAV_LINKS.map(l => (
            <Link
              key={l.label}
              to={l.href}
              className="nav-link text-base"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          <div className="flex flex-col gap-3 pt-4 border-t border-gh-border">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <button className="btn-outline font-bebas tracking-widest w-full py-2.5">
                    DASHBOARD
                  </button>
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <button className="btn-primary font-bebas tracking-widest w-full py-2.5">
                    PROFILE
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <button className="btn-outline font-bebas tracking-widest w-full py-2.5">
                    LOG IN
                  </button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <button className="btn-primary font-bebas tracking-widest w-full py-2.5">
                    JOIN NOW
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}