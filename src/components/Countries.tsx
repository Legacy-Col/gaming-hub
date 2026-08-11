import { motion } from 'framer-motion'

// Real national flag colors for each country, used for the accent stripe + glow
export const COUNTRIES = [
  { name: 'Nigeria', flag: '🇳🇬', colors: ['#008751', '#FFFFFF', '#008751'] },
  { name: 'Egypt', flag: '🇪🇬', colors: ['#CE1126', '#FFFFFF', '#000000'] },
  { name: 'Ghana', flag: '🇬🇭', colors: ['#CE1126', '#FCD116', '#006B3F'] },
  { name: 'Kenya', flag: '🇰🇪', colors: ['#000000', '#BB0000', '#006600'] },
  { name: 'Rwanda', flag: '🇷🇼', colors: ['#00A1DE', '#FAD201', '#007A29'] },
  { name: 'Uganda', flag: '🇺🇬', colors: ['#000000', '#FCDC04', '#D90000'] },
  { name: 'Burkina Faso', flag: '🇧🇫', colors: ['#EF2B2D', '#FCD116', '#009E49'] },
  { name: 'Ivory Coast', flag: '🇨🇮', colors: ['#F77F00', '#FFFFFF', '#009E60'] },
]

function CountryChip({ name, flag, colors }: { name: string; flag: string; colors: string[] }) {
  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`
  const glow = colors[0]

  return (
    <motion.div
      className="relative overflow-hidden flex items-center gap-3 bg-gh-card border border-gh-border px-5 py-4 pt-5 clip-md cursor-default"
      style={{ '--glow': glow } as React.CSSProperties}
      whileHover={{
        scale: 1.08,
        y: -6,
        rotate: [0, -2, 2, -1, 0],
        boxShadow: `0 12px 28px -8px ${glow}66`,
        borderColor: glow,
      }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 9 }}
    >
      {/* Flag color stripe */}
      <span
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: gradient }}
      />

      <motion.span
        className="text-2xl md:text-3xl leading-none"
        whileHover={{ scale: 1.3, rotate: [0, -15, 15, 0] }}
        transition={{ type: 'spring', stiffness: 500, damping: 6 }}
      >
        {flag}
      </motion.span>
      <span className="font-rajdhani font-semibold text-sm md:text-base tracking-wide text-gh-text">
        {name}
      </span>
    </motion.div>
  )
}

export function Countries() {
  return (
    <section id="countries" className="px-4 md:px-12 py-20 md:py-28">
      <div className="border-l-[3px] border-gh-red pl-5 mb-12 sm:mb-16">
        <p className="section-label text-gh-red">// PAN-AFRICAN REACH</p>
        <h2 className="section-heading" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
          COUNTRIES WE<br />
          <span className="text-gh-muted">OPERATE IN</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {COUNTRIES.map((c) => (
          <CountryChip key={c.name} name={c.name} flag={c.flag} colors={c.colors} />
        ))}
      </div>
    </section>
  )
}