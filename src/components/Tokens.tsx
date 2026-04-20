import { Button } from './ui/Button'
import { SectionHeader } from './Features'

const EARN_RATES = [
  { placement: '1st Place Win', tokens: 150, color: 'text-gh-gold', border: 'border-gh-gold' },
  { placement: '2nd Place', tokens: 80, color: 'text-[#aaaaaa]', border: 'border-[#555]' },
  { placement: '3rd Place', tokens: 40, color: 'text-[#cd7f32]', border: 'border-[#7a4a1e]' },
  { placement: 'Participation', tokens: 10, color: 'text-gh-muted', border: 'border-gh-border' },
]

const USE_CASES = [
  { icon: '🛒', title: 'Store Discounts', desc: 'Up to 30% off merch purchases with tokens.' },
  { icon: '🎫', title: 'Tournament Entry', desc: 'Bypass cash entry fees for premium events.' },
  { icon: '📦', title: 'Exclusive Drops', desc: 'Token-gated limited edition gaming & anime gear.' },
  { icon: '✦', title: 'Profile Flair', desc: 'Rare badges, animated borders & rank icons.' },
]

export function Tokens() {
  return (
    <section id="tokens" className="px-4 sm:px-6 lg:px-12 py-20 sm:py-28 bg-[#0c0c0c] relative overflow-hidden">
      {/* Gold glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(255,184,0,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left — explainer */}
        <div>
          <SectionHeader
            label="FORGE TOKEN SYSTEM"
            heading="WIN MATCHES. EARN TOKENS."
            sub="SPEND POWER."
            accentColor="text-gh-gold"
          />

          <p className="font-rajdhani text-base sm:text-lg text-gh-muted leading-relaxed font-medium mb-8">
            HUB Tokens (◈) are earned based on your team's aggregate tournament wins across all game titles.
            The more you win, the more your balance grows — and the more buying power you unlock.
          </p>

          <div className="divide-y divide-gh-border border-t border-gh-border">
            {EARN_RATES.map(r => (
              <div key={r.placement} className="flex items-center justify-between py-4">
                <span className="font-rajdhani font-semibold text-base text-gh-muted">{r.placement}</span>
                <span className={`inline-flex items-center gap-1.5 border px-3 py-1 font-mono text-xs rounded-sm ${r.color} ${r.border} bg-transparent`}>
                  ◈ {r.tokens} Tokens
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button variant="gold">See Token Rewards</Button>
          </div>
        </div>

        {/* Right — use cases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {USE_CASES.map((u, i) => (
            <div
              key={i}
              className="bg-gh-card border border-gh-border border-t-gh-gold-dim border-t-2 p-5 sm:p-6 transition-colors duration-200 hover:border-gh-gold"
            >
              <div className="text-2xl mb-3">{u.icon}</div>
              <div className="font-rajdhani font-bold text-base text-gh-gold mb-2">{u.title}</div>
              <div className="font-rajdhani text-sm text-gh-muted leading-relaxed">{u.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
