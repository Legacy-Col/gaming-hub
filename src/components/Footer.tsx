import logoImg from '../assets/hub.jpeg'

const LINKS = {
  Platform: [
    'Tournaments',
    'Rankings',
    'Store',
    'Token System'
  ],

  Games: ['Valorant',
    'FIFA 25',
    'Call of Duty',
    'eFootball',
    'Mortal Kombat'
  ],

  Company: [
    'About',
    'Contact',
    'Careers',
    'Press'],
}

export function Footer() {
  return (
    <footer className="px-4 md:px-12 pt-14 pb-8 border-t border-gh-border bg-gh-bg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div>
          <div className="col-span-2 sm:col-span-1">
            <img
              src={logoImg}
              alt="Gaming Hub Africa"
              className="h-24 w-auto object-contain mb-3"
            />
            <p className="font-rajdhani text-sm text-gh-muted leading-relaxed max-w-[220px]">
              Africa's premier competitive gaming platform. Tournaments. Rankings. Store. Community.
            </p>
          </div>
          <p className="text-gh-muted text-xs leading-relaxed max-w-[220px]">
            Nigeria's premier competitive gaming platform. Tournaments. Rankings. Store. Community.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <div className="font-bebas text-lg tracking-widest text-gh-red mb-4">{heading}</div>
            <ul className="flex flex-col gap-2.5">
              {links.map(l => (
                <li key={l}>
                  <a href="#" className="nav-link text-xs">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gh-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-mono text-xs text-gh-muted">
          © {new Date().getFullYear()} GAMINGHUB.NG — ALL RIGHTS RESERVED
        </span>
        <span className="token-badge text-[10px]">BUILT FOR NIGERIAN GAMERS ◈</span>
      </div>
    </footer>
  )
}
