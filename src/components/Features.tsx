import { Link } from "react-router-dom";





export const FEATURES = [
  {
    icon: '⚔',
    title: 'Tournaments',
    desc: 'Bracket and round-robin competitions across FIFA, Valorant, Call of Duty, eFootball and more.',
    accent: 'text-gh-red',
    border: 'hover:border-gh-red',
    link: '/tournaments',
  },
  {
    icon: '🏆',
    title: 'Team Rankings',
    desc: 'Dynamic score-based ladder. Every win or loss shifts your team rank in real time across all titles.',
    accent: 'text-gh-gold',
    border: 'hover:border-gh-gold',
    link: '/rankings',
  },
  {
    icon: '◈',
    title: 'HUB Tokens',
    desc: 'Win tournaments, earn HUB tokens. Aggregate across games for rewards, store discounts and perks.',
    accent: 'text-gh-gold',
    border: 'hover:border-gh-gold',
    link: '/dashboard',
  },
  {
    icon: '🎮',
    title: 'Gaming Store',
    desc: 'Shop licensed gaming peripherals and premium anime merch. More wins, more tokens, more power.',
    accent: 'text-gh-red',
    border: 'hover:border-gh-red',
    link: '/store',
  },
]

export function SectionHeader({ label, heading, sub, accentColor = 'text-gh-red' }: {
  label: string;
  heading: string;
  sub: string;
  accentColor?: string
}) {
  return (
    <div className={`border-l-[3px] pl-5 mb-12 sm:mb-16 ${accentColor === 'text-gh-gold' ? 'border-gh-gold' : 'border-gh-red'}`}>
      <div className={`section-label ${accentColor}`}>// {label}</div>
      <h2 className="section-heading" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
        {heading}<br />
        <span className="text-gh-muted">{sub}</span>
      </h2>
    </div>
  )
}

export function Features() {
  return (
    <section id="tournaments" className="px-4 md:px-12 py-20 md:py-28">
      {/* Heading */}
      <div className="border-l-[3px] border-gh-red pl-5 mb-14">
        <p className="section-label text-gh-red">// PLATFORM FEATURES</p>
        <h2 className="section-heading text-4xl md:text-5xl lg:text-6xl">
          EVERYTHING YOU NEED<br />
          <span className="text-gh-muted">TO DOMINATE</span>
        </h2>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gh-border">
        {FEATURES.map((f, i) => (
          <Link key={i} to={f.link} className={`feature-card ${f.border}`}>
            <div key={i} className={`feature-card ${f.border}`}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className={`font-bebas text-2xl md:text-3xl tracking-widest mb-3 ${f.accent}`}>{f.title}</h3>
              <p className="text-gh-muted text-sm md:text-base leading-relaxed font-medium">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
