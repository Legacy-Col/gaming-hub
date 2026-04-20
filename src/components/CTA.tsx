import { Button } from './ui/Button'

function GridBG() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden>
        <defs>
          <pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FF2200" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-grid)" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,34,0,0.07)_0%,transparent_70%)]" />
    </div>
  )
}

export function CTA() {
  return (
    <section className="relative px-4 md:px-12 py-24 md:py-36 text-center overflow-hidden bg-[#0a0a0a] border-y border-gh-border">
      <GridBG />
      <div className="relative z-10">
        <h2
          className="font-bebas tracking-wide leading-none text-gh-text mb-6"
          style={{ fontSize: 'clamp(44px, 7vw, 86px)' }}
        >
          READY TO<br />
          <span className="text-gh-red">ENTER THE GAMING HUB?</span>
        </h2>
        <p className="text-gh-muted text-base md:text-lg font-medium mb-10 max-w-xl mx-auto">
          Create your team. Register for tournaments. Start earning HUB tokens today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg">Create Your Team</Button>
          <Button variant="outline" size="lg">Browse Tournaments</Button>
        </div>
      </div>
    </section>
  )
}
