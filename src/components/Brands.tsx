import { motion } from 'framer-motion'
// import MetaceneLogo from '@/assets/brands/metacene.svg'
//  import GacomLogo from '@/assets/brands/gacom.svg'
// import EscapeTheMatrixLogo from '@/assets/brands/escape-the-matrix.svg'
// import VikuverseLogo from '@/assets/brands/vikuverse.svg'
import Carry1stLogo from '@/assets/brands/carry1st.jpg'

export const BRANDS = [
  { name: 'Metacene', logo: "" },
  { name: 'Engy Africa', logo: "" },
  { name: 'Gacom', logo: "" },
  { name: 'Escape The Matrix', logo: "", tag: 'AU · Web3 Gaming' },
  { name: 'Vikuverse', logo: "", tag: 'AU · Web3 Gaming' },
  { name: 'Carry1st', logo: Carry1stLogo, tag: "Africa's Biggest Gaming Shop" },
]

function BrandItem({ name, logo, tag }: { name: string; logo: string; tag?: string }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-2 px-8 md:px-12 shrink-0"
      whileHover={{ scale: 1.18, y: -8, rotate: [0, -3, 3, -2, 0] }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 8 }}
    >
      <img
        src={logo}
        alt={name}
        title={name}
        className="h-8 md:h-10 w-auto object-contain grayscale opacity-70 transition-[filter,opacity] duration-200 hover:grayscale-0 hover:opacity-100"
      />
      {tag && (
        <span className="font-mono text-[10px] tracking-widest text-gh-faint uppercase whitespace-nowrap">
          {tag}
        </span>
      )}
    </motion.div>
  )
}

export function Brands() {
  // Duplicate the list so the track can loop seamlessly at -50%
  const track = [...BRANDS, ...BRANDS]

  return (
    <section id="brands" className="px-4 md:px-12 py-16 md:py-20 overflow-hidden">
      <div className="border-l-[3px] border-gh-gold pl-5 mb-10 md:mb-14">
        <p className="section-label text-gh-gold">// TRUSTED BY</p>
        <h2 className="section-heading text-3xl md:text-4xl lg:text-5xl">
          BRANDS WE'VE<br />
          <span className="text-gh-muted">WORKED WITH</span>
        </h2>
      </div>

      <div className="relative border-y border-gh-border py-8 md:py-10">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-gh-bg to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-gh-bg to-transparent z-10" />

        <motion.div
          className="flex items-center w-max"
          initial={{ x: 0 }}
          whileInView={{ x: '-50%' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ x: { duration: 28, ease: 'linear', repeat: Infinity } }}
        >
          {track.map((brand, i) => (
            <BrandItem key={`${brand.name}-${i}`} name={brand.name} logo={brand.logo} tag={brand.tag} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}