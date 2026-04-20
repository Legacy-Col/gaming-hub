import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'

export function NotFoundPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gh-bg flex items-center justify-center px-4 relative overflow-hidden">

                {/* Background grid */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
                        <defs>
                            <pattern id="404-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7B2FBE" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#404-grid)" />
                    </svg>
                    <div className="absolute inset-0"
                        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(123,47,190,0.06) 0%, transparent 70%)' }} />
                </div>

                <div className="relative z-10 text-center max-w-lg">
                    {/* 404 number */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div
                            className="font-bebas text-gh-purple leading-none select-none"
                            style={{ fontSize: 'clamp(120px, 20vw, 200px)', opacity: 0.15 }}
                        >
                            404
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col items-center gap-5 -mt-8"
                    >
                        {/* HUD corners */}
                        <div className="relative px-8 py-6">
                            {/* Corner decorations */}
                            {[
                                'top-0 left-0 border-t-2 border-l-2',
                                'top-0 right-0 border-t-2 border-r-2',
                                'bottom-0 left-0 border-b-2 border-l-2',
                                'bottom-0 right-0 border-b-2 border-r-2',
                            ].map((cls, i) => (
                                <div
                                    key={i}
                                    className={`absolute w-4 h-4 border-gh-purple ${cls}`}
                                />
                            ))}

                            <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-3">
                                // PAGE NOT FOUND
                            </div>
                            <h1 className="font-bebas text-gh-text leading-none mb-2"
                                style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
                                YOU'VE LEFT<br />
                                <span className="text-gh-purple">THE ARENA</span>
                            </h1>
                            <p className="font-rajdhani text-gh-muted text-sm leading-relaxed">
                                The page you're looking for doesn't exist or has been moved.
                                Head back to the arena and keep fighting.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link to="/">
                                <button className="btn-primary font-bebas tracking-widest text-lg px-8 py-3">
                                    BACK TO HOME
                                </button>
                            </Link>
                            <Link to="/tournaments">
                                <button className="btn-outline font-bebas tracking-widest text-lg px-8 py-3">
                                    VIEW TOURNAMENTS
                                </button>
                            </Link>
                        </div>

                        {/* Quick links */}
                        <div className="flex flex-wrap gap-4 justify-center mt-2">
                            {[
                                { label: 'Dashboard', href: '/dashboard' },
                                { label: 'Rankings', href: '/rankings' },
                                { label: 'Store', href: '/store' },
                                { label: 'My Team', href: '/team' },
                            ].map(l => (
                                <Link
                                    key={l.href}
                                    to={l.href}
                                    className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint hover:text-gh-purple transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    )
}