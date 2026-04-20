import { Button } from './ui/Button'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { useStats } from '@/hooks/useStats'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from 'framer-motion'
import { Link } from 'react-router-dom'

function GridBG() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = window.innerWidth < 768

  // Raw mouse position values
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Transform mouse position into parallax offsets for each layer
  const gamepadX = useTransform(rawX, [-0.5, 0.5], [-18, 18])
  const gamepadY = useTransform(rawY, [-0.5, 0.5], [-18, 18])
  const shapesX = useTransform(rawX, [-0.5, 0.5], [-10, 10])
  const shapesY = useTransform(rawY, [-0.5, 0.5], [-10, 10])
  const particlesX = useTransform(rawX, [-0.5, 0.5], [-5, 5])
  const particlesY = useTransform(rawY, [-0.5, 0.5], [-5, 5])

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -0.5 → 0.5 range
      rawX.set(e.clientX / window.innerWidth - 0.5)
      rawY.set(e.clientY / window.innerHeight - 0.5)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, rawX, rawY])

  // Spinning ring rotation — runs every frame
  const ringRotation = useMotionValue(0)
  useAnimationFrame((_, delta) => {
    ringRotation.set(ringRotation.get() + delta * 0.02)
  })

  const particles = isMobile
    ? [[12, 20], [55, 70], [80, 35], [30, 85], [40, 45]]
    : [[8, 15], [20, 70], [35, 35], [50, 80], [65, 20], [78, 60], [90, 40], [15, 50], [42, 10], [70, 85]]

  const goldParticles = isMobile
    ? [[40, 45], [70, 20]]
    : [[25, 30], [60, 55], [85, 75], [48, 65]]

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* ── Grid ─────────────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]">
        <defs>
          <pattern id="gh-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FF2200" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gh-grid)" />
      </svg>

      {/* ── Radial glow ──────────────────────────────── */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(123,47,190,0.14) 0%, transparent 70%)'
        }} />

      {/* ── Scanline ─────────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, #7B2FBE 30%, #FFB800 50%, #7B2FBE 70%, transparent)'
        }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── HUD corners ──────────────────────────────── */}
      {[
        'top-4 left-4  border-t-2 border-l-2',
        'top-4 right-4 border-t-2 border-r-2',
        'bottom-4 left-4  border-b-2 border-l-2',
        'bottom-4 right-4 border-b-2 border-r-2',
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute w-6 h-6 border-purple-700 ${cls}`}
          animate={{ opacity: [0.6, 0.15, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Particles layer ──────────────────────────── */}
      <motion.div
        className="absolute inset-0"
        style={{ x: particlesX, y: particlesY }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      >
        {/* Red particles */}
        {particles.map(([x, y], i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-800"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{ opacity: [8, 4, 6], scale: [2, 3, 2] }}
            transition={{ duration: 2.5 + (i % 3) * 0.8, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}

        {/* Gold particles */}
        {goldParticles.map(([x, y], i) => (
          <motion.div
            key={`g${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-gh-gold"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{ opacity: [8, 4, 6], scale: [2, 3, 2] }}
            transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.5 + 1, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {/* ── Floating shapes layer ─────────────────────── */}
      <motion.div
        className="absolute inset-0"
        style={{ x: shapesX, y: shapesY }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        {/* Hexagon — top right */}
        <motion.svg
          className="absolute opacity-[15]"
          style={{ top: '8%', right: isMobile ? '2%' : '8%', width: isMobile ? 80 : 120 }}
          viewBox="0 0 100 100"
          animate={{ y: [0, -22, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="none" stroke="#7B2FBE" strokeWidth="1.5" />
          <polygon points="50,20 80,35 80,65 50,80 20,65 20,35"
            fill="none" stroke="#7B2FBE" strokeWidth="0.8" strokeDasharray="4 4" />
        </motion.svg>

        {/* Diamond — bottom left */}
        <motion.svg
          className="absolute opacity-[15]"
          style={{ bottom: '15%', left: isMobile ? '2%' : '5%', width: isMobile ? 60 : 90 }}
          viewBox="0 0 100 100"
          animate={{ y: [0, -18, 0], rotate: [45, 55, 45] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <polygon points="50,5 95,50 50,95 5,50"
            fill="none" stroke="#7B2FBE" strokeWidth="1.5" />
          <polygon points="50,25 75,50 50,75 25,50"
            fill="none" stroke="#7B2FBE" strokeWidth="0.8" />
        </motion.svg>

        {/* Triangle — desktop only */}
        {!isMobile && (
          <motion.svg
            className="absolute opacity-[15]"
            style={{ top: '55%', right: '20%', width: 60 }}
            viewBox="0 0 100 100"
            animate={{ y: [0, -14, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            <polygon points="50,5 95,90 5,90"
              fill="none" stroke="#7B2FBE" strokeWidth="1.5" />
          </motion.svg>
        )}
      </motion.div>

      {/* ── Gamepad layer ─────────────────────────────── */}
      <motion.div
        className="absolute opacity-[15]"
        style={{
          bottom: isMobile ? '5%' : '12%',
          right: isMobile ? '3%' : '12%',
          width: isMobile ? 90 : 150,
          opacity: 10,
          x: gamepadX,
          y: gamepadY,
        }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 200 130" fill="none">
          {/* Body */}
          <path d="M 30 50 Q 10 50 10 75 Q 10 115 40 115 Q 60 115 70 95 L 130 95 Q 140 115 160 115 Q 190 115 190 75 Q 190 50 170 50 L 125 45 Q 100 38 75 45 Z"
            stroke="#7B2FBE" strokeWidth="2" />
          {/* Grip details */}
          <path d="M 25 80 Q 20 95 35 108" stroke="#7B2FBE" strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M 175 80 Q 180 95 165 108" stroke="#7B2FBE" strokeWidth="1.2" strokeDasharray="3 3" />
          {/* D-pad */}
          <rect x="48" y="60" width="8" height="24" rx="2" stroke="#7B2FBE" strokeWidth="1.5" />
          <rect x="40" y="68" width="24" height="8" rx="2" stroke="#7B2FBE" strokeWidth="1.5" />
          {/* Face buttons */}
          <circle cx="140" cy="62" r="5" stroke="#7B2FBE" strokeWidth="1.5" />
          <circle cx="153" cy="72" r="5" stroke="#7B2FBE" strokeWidth="1.5" />
          <circle cx="140" cy="82" r="5" stroke="#7B2FBE" strokeWidth="1.5" />
          <circle cx="127" cy="72" r="5" stroke="#7B2FBE" strokeWidth="1.5" />
          {/* Joysticks */}
          <circle cx="75" cy="78" r="10" stroke="#7B2FBE" strokeWidth="1.5" />
          <circle cx="75" cy="78" r="4" stroke="#7B2FBE" strokeWidth="1" />
          <circle cx="118" cy="78" r="10" stroke="#7B2FBE" strokeWidth="1.5" />
          <circle cx="118" cy="78" r="4" stroke="#7B2FBE" strokeWidth="1" />
          {/* Menu buttons */}
          <rect x="88" y="58" width="8" height="4" rx="2" stroke="#7B2FBE" strokeWidth="1" />
          <rect x="104" y="58" width="8" height="4" rx="2" stroke="#7B2FBE" strokeWidth="1" />
          {/* Shoulder buttons */}
          <path d="M 50 48 Q 60 38 100 38 Q 140 38 150 48" stroke="#7B2FBE" strokeWidth="1.5" />
          <path d="M 58 46 Q 68 36 100 36 Q 132 36 142 46" stroke="#7B2FBE" strokeWidth="0.8" strokeDasharray="3 3" />
          {/* Spinning orbit ring */}
          <motion.circle
            cx="100" cy="76" r="68"
            stroke="#7B2FBE" strokeWidth="0.5" strokeDasharray="4 12"
            style={{ rotate: ringRotation, originX: '100px', originY: '76px' }}
          />
        </svg>
      </motion.div>

      {/* ── Bottom fade ───────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
    </div>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-bebas text-3xl md:text-4xl text-gh-gold tracking-wide">{value}</div>
      <div className="font-rajdhani text-[11px] tracking-[2px] uppercase text-gh-muted font-semibold">{label}</div>
    </div>
  )
}

export function Hero() {
  const { data: stats, loading } = useStats()

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `₦${(n / 1_000_000).toFixed(1)}M+`
      : n >= 1_000
        ? `${(n / 1_000).toFixed(0)}K+`
        : `${n}+`

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-4 md:px-12 pt-16 overflow-hidden"
    >
      <GridBG />

      <div className="relative z-10 max-w-3xl w-full">
        {/* Badge */}
        <div className="token-badge mb-6 text-[11px]">◈ AFRICA'S PREMIER GAMING PLATFORM</div>

        {/* Headline */}
        <h1
          className="font-bebas leading-[0.92] tracking-wide animate-fadeUp"
          style={{ fontSize: 'clamp(60px, 10vw, 116px)' }}
        >
          FORGE YOUR<br />
          <span className="text-gh-purple">LEGACY</span><br />
          <span className="text-gh-muted" style={{ fontSize: 'clamp(36px, 5.5vw, 68px)' }}>
            IN EVERY MATCH
          </span>
        </h1>

        {/* Sub */}
        <p className="mt-6 mb-10 text-base md:text-lg leading-relaxed text-gh-muted font-medium max-w-xl animate-fadeUp [animation-delay:150ms]">
          Compete in tournaments. Climb the rankings. Earn FORGE tokens.
          Shop gaming &amp; anime gear — all in one arena built for Nigerian gamers.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 animate-fadeUp [animation-delay:300ms]">
          <Link to='/tournaments'>
            <Button variant="primary" size="lg">Enter the Arena</Button>
          </Link>
          <Link to='/rankings'>
            <Button variant="outline" size="lg">View Rankings</Button>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-14 animate-fadeUp [animation-delay:450ms]">
          {loading ? (
            <LoadingSpinner />
          ) : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 border-t border-gh-border pt-8">
              <StatItem value={`${stats.activePlayers.toLocaleString()}+`} label="Active Players" />
              <StatItem value={`${stats.tournamentsRun}+`} label="Tournaments Run" />
              <StatItem value={`${stats.gameTitles}`} label="Game Titles" />
              <StatItem value={fmt(stats.totalPrizesNGN)} label="Prizes Awarded" />
            </div>
          ) : null}
        </div>
      </div>

      {/* Decorative ring — hidden on small screens */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
        <svg width="380" height="380" viewBox="0 0 380 380" fill="none" aria-hidden>
          <circle cx="190" cy="190" r="180" stroke="#FF2200" strokeWidth="1" />
          <circle cx="190" cy="190" r="140" stroke="#FF2200" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="190" cy="190" r="100" stroke="#FFB800" strokeWidth="0.5" />
          <circle cx="190" cy="190" r="60" stroke="#FF2200" strokeWidth="1" />
          <line x1="10" y1="190" x2="370" y2="190" stroke="#FF2200" strokeWidth="0.5" />
          <line x1="190" y1="10" x2="190" y2="370" stroke="#FF2200" strokeWidth="0.5" />
        </svg>
      </div>
    </section>
  )
}
